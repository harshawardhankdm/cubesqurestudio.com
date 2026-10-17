/**
 * High-Performance Framework-Agnostic Custom Cursor Engine
 * - Zero React inside the animation loop
 * - Sleeps when idle (stops rAF when pointer stops and springs settle)
 * - Frame-rate independent exponential smoothing (1 - exp(-k * dt))
 * - Single delegated pointerover listener for hover targets
 * - Millisecond timestamp lifetimes for particles (no stuck particles)
 * - Adaptive quality downgrade based on 30-frame rolling average
 */

export interface CursorEngineOptions {
  tier?: 'high' | 'mid' | 'low'
  debug?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  birth: number
  lifetime: number
}

const SECTION_COLORS: Record<string, string> = {
  hero: '#0058CC',
  services: '#8B5CF6',
  work: '#0058CC',
  process: '#8CC2FF',
  contact: '#10B981',
}

export class CursorEngine {
  private abortController: AbortController | null = null
  private options: CursorEngineOptions
  private tier: 'high' | 'mid' | 'low'
  private qualityLevel: number = 3 // 3: high (all), 2: no sparkles, 1: no morph, 0: dot only

  // DOM elements
  private rootEl: HTMLDivElement | null = null
  private dotEl: HTMLDivElement | null = null
  private dotInnerEl: HTMLDivElement | null = null
  private ringWrapperEl: HTMLDivElement | null = null
  private ringEl: HTMLDivElement | null = null
  private ringInnerEl: HTMLDivElement | null = null
  private labelEl: HTMLSpanElement | null = null
  private caretWrapperEl: HTMLDivElement | null = null
  private canvasEl: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private shockwavePool: HTMLDivElement[] = []
  private shockwaveIdx = 0

  // Pointer state
  private clientX = -100
  private clientY = -100
  private lastMoveTime = 0
  private isPointerDown = false
  private isInsideWindow = false
  private currentSection = 'hero'
  private isDarkSection = false

  // Coordinates & Springs (frame-rate independent)
  private ringX = -100
  private ringY = -100
  private ringWidth = 36
  private ringHeight = 36
  private ringRadius = 18

  private targetWidth = 36
  private targetHeight = 36
  private targetRadius = 18

  private velocityX = 0
  private velocityY = 0
  private prevClientX = -100
  private prevClientY = -100
  private prevTime = 0

  // Morph target
  private hoverTarget: HTMLElement | null = null
  private hoverType: 'default' | 'morph' | 'work-card' | 'tesseract' | 'input' = 'default'

  // Render loop
  private rafId: number | null = null
  private isLoopRunning = false
  private lastFrameTime = 0

  // Adaptive performance tracking
  private frameTimes: number[] = []
  private slowFrameStartTime = 0

  // Canvas sparkles
  private particles: Particle[] = []

  // Debug overlay
  private debugOverlay: HTMLDivElement | null = null
  private debugFps = 60

  constructor(options: CursorEngineOptions = {}) {
    this.options = options
    this.tier = options.tier || 'mid'

    // Determine initial quality level from tier and sessionStorage
    if (this.tier === 'high') this.qualityLevel = 3
    else if (this.tier === 'mid') this.qualityLevel = 2
    else this.qualityLevel = 0

    if (typeof window !== 'undefined') {
      const savedLevel = sessionStorage.getItem('cs_cursor_tier')
      if (savedLevel !== null) {
        this.qualityLevel = Math.min(this.qualityLevel, parseInt(savedLevel, 10))
      }
    }
  }

  public init(): boolean {
    if (typeof window === 'undefined') return false

    try {
      // 1. Check capability & switches
      const search = window.location.search
      if (search.includes('cursor=off')) return false

      const isDebug = search.includes('cursor=debug') || !!this.options.debug

      // Gating: Only fine hover pointers, no reduced motion, no low tier
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!finePointer || prefersReduced || this.tier === 'low' || this.qualityLevel === 0) {
        return false
      }

      this.abortController = new AbortController()
      const { signal } = this.abortController

      // 2. Build DOM structures
      this.buildDOM()
      if (isDebug) this.buildDebugOverlay()

      // 3. Attach listeners with AbortSignal
      this.attachEvents(signal)

      // Initial state: hide until first pointer movement
      this.setVisible(false)

      return true
    } catch (err) {
      console.warn('CursorEngine failed to initialize:', err)
      this.destroy()
      return false
    }
  }

  private buildDOM(): void {
    // Root container
    const root = document.createElement('div')
    root.className = 'cs-cursor-root'
    root.setAttribute('aria-hidden', 'true')
    root.setAttribute('data-cursor-root', 'true')
    Object.assign(root.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '99999',
      contain: 'layout paint style',
      overflow: 'hidden',
    })
    this.rootEl = root

    // 1. Sparkle Canvas (Quality level 3 only)
    if (this.qualityLevel >= 3) {
      const canvas = document.createElement('canvas')
      canvas.className = 'cs-cursor-canvas'
      Object.assign(canvas.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '99990',
      })
      this.canvasEl = canvas
      this.ctx = canvas.getContext('2d')
      root.appendChild(canvas)
      this.updateCanvasSize()
    }

    // 2. Shockwave elements pool
    const shockwaveContainer = document.createElement('div')
    Object.assign(shockwaveContainer.style, {
      position: 'fixed',
      inset: '0px',
      pointerEvents: 'none',
      zIndex: '99992',
    })
    for (let i = 0; i < 3; i++) {
      const sw = document.createElement('div')
      Object.assign(sw.style, {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1.5px solid var(--cursor-accent, #0058CC)',
        pointerEvents: 'none',
        opacity: '0',
        transform: 'translate3d(-100px, -100px, 0) scale(1)',
        willChange: 'transform, opacity',
      })
      shockwaveContainer.appendChild(sw)
      this.shockwavePool.push(sw)
    }
    root.appendChild(shockwaveContainer)

    // 3. Dot (exact tracking)
    const dotWrapper = document.createElement('div')
    Object.assign(dotWrapper.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      zIndex: '99998',
      willChange: 'transform',
      transform: 'translate3d(-100px, -100px, 0)',
    })
    const dotInner = document.createElement('div')
    Object.assign(dotInner.style, {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'var(--cursor-accent, #0058CC)',
      transform: 'translate3d(-50%, -50%, 0)',
      boxShadow: '0 0 8px rgba(0, 88, 204, 0.45)',
      transition: 'background-color 200ms ease, opacity 180ms ease, transform 180ms ease',
    })
    dotWrapper.appendChild(dotInner)
    root.appendChild(dotWrapper)
    this.dotEl = dotWrapper
    this.dotInnerEl = dotInner

    // 4. Ring (smooth follower + morph outline)
    const ringWrapper = document.createElement('div')
    Object.assign(ringWrapper.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      zIndex: '99995',
      willChange: 'transform',
      transform: 'translate3d(-100px, -100px, 0)',
    })

    const ring = document.createElement('div')
    Object.assign(ring.style, {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '18px',
      border: '1.5px solid var(--cursor-ring-color, rgba(0, 88, 204, 0.45))',
      background: 'rgba(255, 255, 255, 0.04)',
      boxShadow: '0 0 12px var(--cursor-glow, rgba(0, 88, 204, 0.15))',
      transform: 'translate3d(-50%, -50%, 0)',
      contain: 'strict',
      transition: 'border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
    })

    const ringInner = document.createElement('div')
    Object.assign(ringInner.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'inherit',
    })

    // Context label (View / Drag pill)
    const label = document.createElement('span')
    Object.assign(label.style, {
      display: 'none',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      backgroundColor: 'var(--cursor-accent, #0058CC)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
      whiteSpace: 'nowrap',
      lineHeight: '1.3',
    })
    ringInner.appendChild(label)
    ring.appendChild(ringInner)
    ringWrapper.appendChild(ring)
    root.appendChild(ringWrapper)

    this.ringWrapperEl = ringWrapper
    this.ringEl = ring
    this.ringInnerEl = ringInner
    this.labelEl = label

    // 5. Blinking Caret Bar for text inputs
    const caretWrapper = document.createElement('div')
    Object.assign(caretWrapper.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      zIndex: '99998',
      display: 'none',
      willChange: 'transform',
      transform: 'translate3d(-100px, -100px, 0)',
    })
    const caret = document.createElement('div')
    caret.className = 'cs-cursor-caret'
    Object.assign(caret.style, {
      width: '2.5px',
      height: '22px',
      borderRadius: '2px',
      backgroundColor: 'var(--cursor-accent, #0058CC)',
      transform: 'translate3d(-50%, -50%, 0)',
      animation: 'cs-caret-blink 900ms ease-in-out infinite',
    })
    caretWrapper.appendChild(caret)
    root.appendChild(caretWrapper)
    this.caretWrapperEl = caretWrapper

    // Inject caret keyframes if needed
    if (!document.getElementById('cs-cursor-style')) {
      const style = document.createElement('style')
      style.id = 'cs-cursor-style'
      style.textContent = `
        @keyframes cs-caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(root)
    this.updateAccentColors()
  }

  private buildDebugOverlay(): void {
    const overlay = document.createElement('div')
    overlay.className = 'cs-cursor-debug'
    Object.assign(overlay.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      zIndex: '999999',
      padding: '6px 10px',
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#00FF66',
      fontFamily: 'monospace',
      fontSize: '11px',
      pointerEvents: 'none',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    })
    document.body.appendChild(overlay)
    this.debugOverlay = overlay
  }

  private attachEvents(signal: AbortSignal): void {
    const opts = { passive: true, signal }

    // Pointer move listener on document (only records coordinates, no DOM writes)
    const onPointerMove = (e: PointerEvent) => {
      // Discard touch pointers
      if (e.pointerType === 'touch') {
        this.setVisible(false)
        return
      }

      this.clientX = e.clientX
      this.clientY = e.clientY
      this.lastMoveTime = performance.now()

      if (!this.isInsideWindow) {
        this.isInsideWindow = true
        this.setVisible(true)
      }

      this.wakeLoop()
    }

    // Pointer down & up for click shockwaves
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      this.isPointerDown = true
      if (this.ringInnerEl) {
        this.ringInnerEl.style.transform = 'scale(0.8)'
        this.ringInnerEl.style.transition = 'transform 100ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
      this.wakeLoop()
    }

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      this.isPointerDown = false
      if (this.ringInnerEl) {
        this.ringInnerEl.style.transform = 'scale(1)'
      }

      // Trigger shockwave
      this.triggerShockwave(e.clientX, e.clientY)

      // High tier sparks on click
      if (this.qualityLevel >= 3 && this.hoverType !== 'input') {
        this.addSparkles(e.clientX, e.clientY, 6, 2.0)
      }

      this.wakeLoop()
    }

    // Delegated hover target listener (one listener for the entire document)
    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const target = e.target as HTMLElement | null
      if (!target) return

      // Section theme check
      const sec = target.closest('section[id]') as HTMLElement | null
      if (sec && sec.id) {
        const secId = sec.id
        if (secId !== this.currentSection) {
          this.currentSection = secId
          this.isDarkSection =
            sec.getAttribute('data-cursor-theme') === 'dark' ||
            sec.getAttribute('data-nav-theme') === 'dark' ||
            secId === 'process'
          this.updateAccentColors()
        }
      }

      // Evaluate hover targets
      this.evaluateTarget(target)
    }

    // Window leave handlers
    const onPointerLeave = () => {
      this.isInsideWindow = false
      this.setVisible(false)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        this.isInsideWindow = false
        this.setVisible(false)
        this.clearParticles()
      }
    }

    const onResize = () => {
      this.updateCanvasSize()
      this.clearParticles()
    }

    document.addEventListener('pointermove', onPointerMove, opts)
    document.addEventListener('pointerdown', onPointerDown, opts)
    document.addEventListener('pointerup', onPointerUp, opts)
    document.addEventListener('pointerover', onPointerOver, opts)

    document.documentElement.addEventListener('pointerleave', onPointerLeave, opts)
    window.addEventListener('blur', onPointerLeave, opts)
    document.addEventListener('visibilitychange', onVisibilityChange, opts)
    window.addEventListener('resize', onResize, opts)
  }

  private evaluateTarget(target: HTMLElement): void {
    if (!target || !target.isConnected) {
      this.setHoverState('default', null)
      return
    }

    // 1. Text input / textarea
    if (target.closest('input, textarea, [contenteditable="true"]')) {
      this.setHoverState('input', null)
      return
    }

    // 2. Work Card
    const workCard = target.closest('#work [data-card]') as HTMLElement | null
    if (workCard) {
      this.setHoverState('work-card', workCard)
      return
    }

    // 3. Hero Tesseract
    const tesseract = target.closest('[data-cursor-tesseract]') as HTMLElement | null
    if (tesseract) {
      this.setHoverState('tesseract', tesseract)
      return
    }

    // 4. Interactive Keys, Links, Buttons
    if (this.qualityLevel >= 2) {
      const interactive = target.closest(
        '[data-cursor], .key, a, button, [role="button"], summary, label'
      ) as HTMLElement | null

      if (interactive) {
        this.setHoverState('morph', interactive)
        return
      }
    }

    this.setHoverState('default', null)
  }

  private setHoverState(type: typeof this.hoverType, el: HTMLElement | null): void {
    if (this.hoverType === type && this.hoverTarget === el) return

    this.hoverType = type
    this.hoverTarget = el

    if (!this.ringEl || !this.labelEl || !this.dotInnerEl || !this.caretWrapperEl) return

    if (type === 'input') {
      this.caretWrapperEl.style.display = 'block'
      this.ringEl.style.opacity = '0'
      this.dotInnerEl.style.opacity = '0'
      this.labelEl.style.display = 'none'
    } else {
      this.caretWrapperEl.style.display = 'none'
      this.ringEl.style.opacity = '1'
      this.dotInnerEl.style.opacity = '1'

      if (type === 'work-card') {
        this.labelEl.textContent = 'View'
        this.labelEl.style.display = 'inline-block'
        this.targetWidth = 54
        this.targetHeight = 28
        this.targetRadius = 14
      } else if (type === 'tesseract') {
        this.labelEl.textContent = 'Drag'
        this.labelEl.style.display = 'inline-block'
        this.targetWidth = 54
        this.targetHeight = 28
        this.targetRadius = 14
      } else if (type === 'morph' && el) {
        this.labelEl.style.display = 'none'
        // Morph dimensions read once per frame while morphed
      } else {
        this.labelEl.style.display = 'none'
        this.targetWidth = 36
        this.targetHeight = 36
        this.targetRadius = 18
      }
    }

    this.wakeLoop()
  }

  private updateAccentColors(): void {
    if (!this.rootEl) return
    const accent = this.isDarkSection
      ? '#8CC2FF'
      : SECTION_COLORS[this.currentSection] || '#0058CC'
    const ringColor = this.isDarkSection
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(0, 88, 204, 0.45)'
    const glow = this.isDarkSection
      ? 'rgba(140, 194, 255, 0.25)'
      : 'rgba(0, 88, 204, 0.18)'

    this.rootEl.style.setProperty('--cursor-accent', accent)
    this.rootEl.style.setProperty('--cursor-ring-color', ringColor)
    this.rootEl.style.setProperty('--cursor-glow', glow)
  }

  private setVisible(visible: boolean): void {
    if (!this.rootEl) return
    this.rootEl.style.display = visible ? 'block' : 'none'
  }

  private wakeLoop(): void {
    if (this.isLoopRunning) return
    this.isLoopRunning = true
    this.lastFrameTime = performance.now()
    this.rafId = requestAnimationFrame(this.renderLoop)
  }

  private renderLoop = (now: number): void => {
    // Calculate clamped dt (max 50ms)
    const dt = Math.max(0.001, Math.min((now - this.lastFrameTime) / 1000, 0.05))
    this.lastFrameTime = now

    // Adaptive Performance: Track frame time rolling average (last 30 frames)
    this.trackPerformance(dt * 1000, now)

    // Calculate instantaneous speed and velocity vector
    const dx = this.clientX - this.prevClientX
    const dy = this.clientY - this.prevClientY
    const dist = Math.hypot(dx, dy)
    const speed = dist / dt

    this.velocityX = dx / dt
    this.velocityY = dy / dt

    this.prevClientX = this.clientX
    this.prevClientY = this.clientY

    // 1. Position Dot exactly at pointer (zero lag)
    if (this.dotEl) {
      this.dotEl.style.transform = `translate3d(${this.clientX}px, ${this.clientY}px, 0)`
    }
    if (this.caretWrapperEl && this.hoverType === 'input') {
      this.caretWrapperEl.style.transform = `translate3d(${this.clientX}px, ${this.clientY}px, 0)`
    }

    // 2. Morph target rect read once per frame while morphed
    let targetX = this.clientX
    let targetY = this.clientY

    if (this.hoverType === 'morph' && this.hoverTarget && this.hoverTarget.isConnected) {
      const rect = this.hoverTarget.getBoundingClientRect()
      targetX = rect.left + rect.width / 2
      targetY = rect.top + rect.height / 2
      this.targetWidth = rect.width + 8
      this.targetHeight = rect.height + 8

      // Cache radius or compute from style
      const cs = window.getComputedStyle(this.hoverTarget)
      this.targetRadius = parseInt(cs.borderRadius || '16', 10)
    }

    // 3. Smooth Ring coordinates using frame-rate independent exponential smoothing
    // formula: value += (target - value) * (1 - Math.exp(-k * dt))
    const smoothK = this.hoverType === 'morph' ? 22 : 18
    const factorPos = 1 - Math.exp(-smoothK * dt)
    const factorSize = 1 - Math.exp(-16 * dt)

    this.ringX += (targetX - this.ringX) * factorPos
    this.ringY += (targetY - this.ringY) * factorPos
    this.ringWidth += (this.targetWidth - this.ringWidth) * factorSize
    this.ringHeight += (this.targetHeight - this.ringHeight) * factorSize
    this.ringRadius += (this.targetRadius - this.ringRadius) * factorSize

    // 4. Velocity Stretch & Rotation (on default circle mode only)
    let stretchScaleX = 1
    let stretchScaleY = 1
    let angleRad = 0

    if (this.hoverType === 'default' && speed > 100) {
      stretchScaleX = 1 + Math.min(speed / 1800, 0.5)
      stretchScaleY = 1 / Math.sqrt(stretchScaleX)
      angleRad = Math.atan2(dy, dx)

      // Emit fast-movement sparkles (High tier)
      if (this.qualityLevel >= 3 && speed > 650) {
        this.addSparkles(this.clientX, this.clientY, 1, 0.7)
      }
    }

    // Write DOM transforms: position on wrapper, scale/rotation on inner ring
    if (this.ringWrapperEl && this.ringEl && this.ringInnerEl) {
      this.ringWrapperEl.style.transform = `translate3d(${this.ringX.toFixed(2)}px, ${this.ringY.toFixed(2)}px, 0)`

      this.ringEl.style.width = `${this.ringWidth.toFixed(1)}px`
      this.ringEl.style.height = `${this.ringHeight.toFixed(1)}px`
      this.ringEl.style.borderRadius = `${this.ringRadius.toFixed(1)}px`

      if (this.hoverType === 'default') {
        this.ringInnerEl.style.transform = `rotate(${angleRad.toFixed(3)}rad) scale(${stretchScaleX.toFixed(3)}, ${stretchScaleY.toFixed(3)})`
      } else {
        this.ringInnerEl.style.transform = 'none'
      }
    }

    // 5. Render Sparkle Canvas (Quality level 3 only)
    if (this.qualityLevel >= 3 && this.particles.length > 0) {
      this.renderSparkles(now)
    }

    // Check if system can sleep
    const pointerIdle = now - this.lastMoveTime > 150
    const deltaPos = Math.hypot(targetX - this.ringX, targetY - this.ringY)
    const deltaSize = Math.abs(this.targetWidth - this.ringWidth)
    const hasActiveParticles = this.particles.length > 0

    if (pointerIdle && deltaPos < 0.1 && deltaSize < 0.1 && !hasActiveParticles && !this.isPointerDown) {
      this.isLoopRunning = false
      this.rafId = null
      return
    }

    this.rafId = requestAnimationFrame(this.renderLoop)
  }

  private trackPerformance(frameDurationMs: number, now: number): void {
    this.frameTimes.push(frameDurationMs)
    if (this.frameTimes.length > 30) this.frameTimes.shift()

    const avgMs = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    this.debugFps = Math.round(1000 / avgMs)

    if (avgMs > 22) {
      if (this.slowFrameStartTime === 0) {
        this.slowFrameStartTime = now
      } else if (now - this.slowFrameStartTime > 1000) {
        // Degrade tier
        this.downgradeQuality()
        this.slowFrameStartTime = 0
      }
    } else {
      this.slowFrameStartTime = 0
    }

    if (this.debugOverlay) {
      this.debugOverlay.textContent = `FPS: ${this.debugFps} | Level: ${this.qualityLevel} | Mode: ${this.hoverType}`
    }
  }

  private downgradeQuality(): void {
    if (this.qualityLevel > 0) {
      this.qualityLevel--
      sessionStorage.setItem('cs_cursor_tier', String(this.qualityLevel))

      if (this.qualityLevel < 3) {
        this.clearParticles()
        if (this.canvasEl) this.canvasEl.style.display = 'none'
      }
      if (this.qualityLevel < 2) {
        this.setHoverState('default', null)
      }
      if (this.qualityLevel === 0) {
        this.destroy()
      }
    }
  }

  private triggerShockwave(x: number, y: number): void {
    const sw = this.shockwavePool[this.shockwaveIdx]
    this.shockwaveIdx = (this.shockwaveIdx + 1) % this.shockwavePool.length
    if (!sw) return

    sw.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) scale(1)`
    sw.style.opacity = '0.5'
    sw.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out'

    // Force reflow
    void sw.offsetWidth

    sw.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) scale(2.4)`
    sw.style.opacity = '0'
  }

  private addSparkles(x: number, y: number, count: number, speedMult: number): void {
    if (this.qualityLevel < 3 || this.particles.length >= 24) return
    const now = performance.now()
    const color = this.isDarkSection
      ? '#FFFFFF'
      : SECTION_COLORS[this.currentSection] || '#0058CC'

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= 24) break
      const angle = Math.random() * Math.PI * 2
      const spd = (Math.random() * 2.2 + 1.2) * speedMult
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.4,
        size: Math.random() * 3.5 + 3.0, // 3 - 6.5px diamond
        color,
        birth: now,
        lifetime: 600 + Math.random() * 200, // Exact ms duration
      })
    }
  }

  private renderSparkles(now: number): void {
    if (!this.ctx || !this.canvasEl) return
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)

    // Filter alive particles
    this.particles = this.particles.filter((p) => {
      const age = now - p.birth
      if (age >= p.lifetime) return false

      const progress = age / p.lifetime
      const alpha = Math.max(0, 1 - progress)
      const currentSize = p.size * (1 - progress * 0.35)

      // Physics: gravity + velocity
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.035 // slight gravity

      // Draw Diamond Sparkle
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - currentSize)
      ctx.lineTo(p.x + currentSize, p.y)
      ctx.lineTo(p.x, p.y + currentSize)
      ctx.lineTo(p.x - currentSize, p.y)
      ctx.closePath()

      ctx.fillStyle = p.color
      ctx.globalAlpha = alpha * 0.75
      ctx.fill()
      ctx.restore()

      return true
    })
  }

  private clearParticles(): void {
    this.particles = []
    if (this.ctx && this.canvasEl) {
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    }
  }

  private updateCanvasSize(): void {
    if (!this.canvasEl || !this.ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.canvasEl.width = Math.round(window.innerWidth * dpr)
    this.canvasEl.height = Math.round(window.innerHeight * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    if (this.rootEl && this.rootEl.parentNode) {
      this.rootEl.parentNode.removeChild(this.rootEl)
    }
    if (this.debugOverlay && this.debugOverlay.parentNode) {
      this.debugOverlay.parentNode.removeChild(this.debugOverlay)
    }
    this.rootEl = null
    this.canvasEl = null
    this.ctx = null
    this.particles = []
    this.isLoopRunning = false
  }
}
