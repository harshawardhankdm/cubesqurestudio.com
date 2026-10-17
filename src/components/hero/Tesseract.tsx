'use client'
import { useEffect, useRef, useState } from 'react'
import { useMotionTier, MOTION_CONFIG } from '@/lib/motion'

// 16 vertices: every combination of ±1 in 4 dimensions
const V: number[][] = []
for (let i = 0; i < 16; i++) {
  V.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1,
  ])
}

// 32 edges: vertex pairs that differ in exactly one coordinate; axis: 0=x, 1=y, 2=z, 3=w
const E: [number, number, number][] = []
for (let i = 0; i < 16; i++) {
  for (let b = 0; b < 4; b++) {
    const j = i ^ (1 << b)
    if (i < j) E.push([i, j, b])
  }
}

// 24 square 2D faces for glassy volume rendering (High tier)
// Formed by pairs of axes (a, b) with other 2 axes fixed
const FACES: [number, number, number, number][] = []
const AXIS_PAIRS: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 2], [1, 3], [2, 3],
]

for (const [a, b] of AXIS_PAIRS) {
  const otherAxes = [0, 1, 2, 3].filter((ax) => ax !== a && ax !== b)
  const c = otherAxes[0]
  const d = otherAxes[1]

  for (const cVal of [0, 1]) {
    for (const dVal of [0, 1]) {
      const getIndex = (aVal: number, bVal: number) =>
        (aVal << a) | (bVal << b) | (cVal << c) | (dVal << d)

      FACES.push([
        getIndex(0, 0),
        getIndex(1, 0),
        getIndex(1, 1),
        getIndex(0, 1),
      ])
    }
  }
}

// Rotate a 4D point in the plane of axes (i, j)
function rot(v: number[], a: number, i: number, j: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const x = v[i]
  const y = v[j]
  v[i] = x * c - y * s
  v[j] = x * s + y * c
}

export default function Tesseract() {
  const tier = useMotionTier()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let isVisible = true
    let lastTime = performance.now()

    // Base rotation angles
    let angleXW = 0
    let angleZW = 0
    let angleXY = 0
    let angleYZ = 0

    // Interactive pointer tilt & drag
    let targetTiltXZ = 0
    let targetTiltYZ = 0
    let currentTiltXZ = 0
    let currentTiltYZ = 0

    let dragVelocityX = 0
    let dragVelocityY = 0
    let isDragging = false
    let lastPointerX = 0
    let lastPointerY = 0

    let hoverSpeedFactor = 1

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || tier === 'low'

    let cssWidth = 300
    let cssHeight = 300
    let renderFrameFn: ((staticRender?: boolean) => void) | null = null

    const updateSize = () => {
      if (!container || !canvas) return
      const rect = container.getBoundingClientRect()
      cssWidth = rect.width || 300
      cssHeight = rect.height || 300
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (prefersReduced && renderFrameFn) {
        renderFrameFn(true)
      }
    }

    updateSize()

    let resizeObserver: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(container)
    } else {
      window.addEventListener('resize', updateSize)
    }

    // Visibility / Intersection Observer
    let intersectionObserver: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting
      })
      intersectionObserver.observe(canvas)
    }

    // Pointer move listener over hero container for subtle tilt
    const handleHeroPointerMove = (e: PointerEvent) => {
      if (prefersReduced) return
      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)))
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)))
      targetTiltXZ = normX * 0.45
      targetTiltYZ = normY * 0.45
    }

    window.addEventListener('pointermove', handleHeroPointerMove, { passive: true })

    // Canvas drag interaction
    const handlePointerDown = (e: PointerEvent) => {
      if (prefersReduced) return
      isDragging = true
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      dragVelocityX = 0
      dragVelocityY = 0
      canvas.setPointerCapture(e.pointerId)
    }

    const handlePointerDrag = (e: PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - lastPointerX
      const dy = e.clientY - lastPointerY
      lastPointerX = e.clientX
      lastPointerY = e.clientY

      dragVelocityX = dx * 0.008
      dragVelocityY = dy * 0.008

      angleXY += dragVelocityX
      angleYZ += dragVelocityY
    }

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        // Ignored
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerDrag)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerUp)

    // Render function
    const renderFrame = (staticRender = false) => {
      renderFrameFn = renderFrame
      ctx.clearRect(0, 0, cssWidth, cssHeight)

      const cx = cssWidth / 2
      const cy = cssHeight / 2
      const baseScale = cssWidth * 1.08
      const isMobile = cssWidth < 240
      const baseLineWidth = isMobile ? 1.5 : 2.0

      // 1. Transform and Project Vertices
      const projected: { x: number; y: number; z: number; w: number; depth: number }[] = []

      for (let i = 0; i < 16; i++) {
        const p = [...V[i]]

        if (staticRender) {
          // Pleasing static rotation angle
          rot(p, 0.6, 0, 3) // XW
          rot(p, 0.4, 2, 3) // ZW
          rot(p, 0.3, 0, 1) // XY
          rot(p, 0.2, 1, 2) // YZ
        } else {
          // Real-time continuous rotation
          rot(p, angleXW, 0, 3)
          rot(p, angleZW, 2, 3)
          rot(p, angleXY, 0, 1)
          rot(p, angleYZ, 1, 2)
          rot(p, currentTiltXZ, 0, 2)
          rot(p, currentTiltYZ, 1, 2)
        }

        // 4D -> 3D projection
        const D4 = 3.2
        const k4 = 1 / Math.max(0.2, D4 - p[3])
        const x3 = p[0] * k4
        const y3 = p[1] * k4
        const z3 = p[2] * k4

        // 3D -> 2D projection
        const D3 = 3.8
        const k3 = 1 / Math.max(0.2, D3 - z3)
        const x2 = x3 * k3 * baseScale + cx
        const y2 = y3 * k3 * baseScale + cy

        // Normalized depth for alpha and scale (closer = higher)
        const depth = (z3 + 1.2) * 0.4 + (p[3] + 1) * 0.2

        projected.push({ x: x2, y: y2, z: z3, w: p[3], depth })
      }

      // 2. High Tier: Translucent 24 faces sorted by average depth (Painter's algorithm)
      if (tier === 'high') {
        const sortedFaces = FACES.map((f) => {
          const avgDepth = (projected[f[0]].depth + projected[f[1]].depth + projected[f[2]].depth + projected[f[3]].depth) / 4
          return { indices: f, avgDepth }
        }).sort((a, b) => a.avgDepth - b.avgDepth)

        for (const face of sortedFaces) {
          const [i0, i1, i2, i3] = face.indices
          const p0 = projected[i0]
          const p1 = projected[i1]
          const p2 = projected[i2]
          const p3 = projected[i3]

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.lineTo(p3.x, p3.y)
          ctx.closePath()

          const faceAlpha = Math.max(0.02, Math.min(0.065, 0.02 + face.avgDepth * 0.04))
          ctx.fillStyle = `rgba(60, 110, 255, ${faceAlpha})`
          ctx.fill()
        }
      }

      // 3. Draw 32 Edges (Sorted back-to-front)
      const sortedEdges = E.map(([i, j, axis]) => {
        const avgDepth = (projected[i].depth + projected[j].depth) / 2
        return { i, j, axis, avgDepth }
      }).sort((a, b) => a.avgDepth - b.avgDepth)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const edge of sortedEdges) {
        const p1 = projected[edge.i]
        const p2 = projected[edge.j]
        const { axis, avgDepth } = edge

        // Colors: x/y/z (#2F6BFF / #4D88FF), w (#6D4AFF)
        let strokeColor: string
        if (axis === 3) {
          // W-axis connecting inner and outer cubes: Vibrant violet
          strokeColor = '#6D4AFF'
        } else {
          // Inner cube vs outer cube
          const isInner = p1.w < 0 && p2.w < 0
          strokeColor = isInner ? '#4D88FF' : '#2F6BFF'
        }

        // Alpha never drops below 0.6
        const edgeAlpha = Math.max(0.6, Math.min(1.0, 0.6 + avgDepth * 0.35))
        const edgeWidth = baseLineWidth * Math.max(0.8, Math.min(1.35, 0.85 + avgDepth * 0.45))

        // Double stroke glow: wide stroke (6px, alpha * 0.12)
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = strokeColor
        ctx.globalAlpha = edgeAlpha * 0.14
        ctx.lineWidth = edgeWidth + 4.5
        ctx.stroke()

        // Crisp sharp stroke
        ctx.globalAlpha = edgeAlpha
        ctx.lineWidth = edgeWidth
        ctx.stroke()
        ctx.restore()
      }

      // 4. Draw 16 Vertices (circles with white center and colored rim)
      const sortedVertices = projected
        .map((p, idx) => ({ p, idx }))
        .sort((a, b) => a.p.depth - b.p.depth)

      for (const { p } of sortedVertices) {
        const radius = Math.max(2.4, Math.min(4.5, 2.5 + p.depth * 2.0))
        const vertexAlpha = Math.max(0.75, Math.min(1.0, 0.75 + p.depth * 0.25))
        const isInner = p.w < 0
        const strokeColor = isInner ? '#4D88FF' : '#2F6BFF'

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.globalAlpha = vertexAlpha
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = strokeColor
        ctx.stroke()
        ctx.restore()
      }
    }

    // Render single static frame for low tier or reduced motion
    if (prefersReduced) {
      renderFrame(true)
      return () => {
        if (resizeObserver) resizeObserver.disconnect()
        else window.removeEventListener('resize', updateSize)
        if (intersectionObserver) intersectionObserver.disconnect()
        window.removeEventListener('pointermove', handleHeroPointerMove)
        canvas.removeEventListener('pointerdown', handlePointerDown)
        canvas.removeEventListener('pointermove', handlePointerDrag)
        canvas.removeEventListener('pointerup', handlePointerUp)
        canvas.removeEventListener('pointercancel', handlePointerUp)
      }
    }

    // Animation Loop (High / Mid Tiers)
    const loop = (now: number) => {
      animId = requestAnimationFrame(loop)
      if (!isVisible || document.hidden) return

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Smooth hover easing (slow to ~40% on hover)
      const targetHoverSpeed = isHovered ? 0.4 : 1.0
      hoverSpeedFactor += (targetHoverSpeed - hoverSpeedFactor) * (1 - Math.exp(-6 * dt))

      const speedMult = MOTION_CONFIG.MOTION_SPEED * hoverSpeedFactor

      // 4D Rotational Speeds
      angleXW += 0.45 * speedMult * dt
      angleZW += 0.32 * speedMult * dt
      angleXY += 0.14 * speedMult * dt
      angleYZ += 0.10 * speedMult * dt

      // Decay drag inertia
      if (!isDragging) {
        dragVelocityX *= Math.pow(0.92, dt * 60)
        dragVelocityY *= Math.pow(0.92, dt * 60)
        angleXY += dragVelocityX
        angleYZ += dragVelocityY
      }

      // Smooth pointer tilt
      currentTiltXZ += (targetTiltXZ - currentTiltXZ) * (1 - Math.exp(-8 * dt))
      currentTiltYZ += (targetTiltYZ - currentTiltYZ) * (1 - Math.exp(-8 * dt))

      renderFrame(false)
    }

    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      if (resizeObserver) resizeObserver.disconnect()
      else window.removeEventListener('resize', updateSize)
      if (intersectionObserver) intersectionObserver.disconnect()
      window.removeEventListener('pointermove', handleHeroPointerMove)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerDrag)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [tier, isHovered])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-tesseract="true"
      className="relative flex items-center justify-center select-none w-[280px] sm:w-[320px] aspect-square max-w-[85vw] mx-auto cursor-grab active:cursor-grabbing"
      style={{
        touchAction: 'pan-y',
      }}
    >
      {/* Soft radial-gradient glow behind tesseract */}
      <div
        className="pointer-events-none absolute inset-[-15%] rounded-full opacity-60 z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(47, 107, 255, 0.16) 0%, rgba(109, 74, 255, 0.08) 45%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* Ground shadow radial ellipse beneath tesseract */}
      <div
        className="pointer-events-none absolute -bottom-5 w-[70%] h-7 rounded-[100%] opacity-45 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14, 24, 60, 0.45) 0%, rgba(14, 24, 60, 0.12) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* 2D Canvas for 4D Tesseract */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full block"
        style={{
          touchAction: 'pan-y',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
