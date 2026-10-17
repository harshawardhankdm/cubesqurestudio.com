'use client'
import { useEffect, useRef } from 'react'
import { useMotionTier } from '@/lib/motion'

export default function HeroParticles() {
  const tier = useMotionTier()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (tier !== 'high') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let isVisible = true
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    // Particle count: 65 particles
    const count = 65
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.min(Math.random() * 1.8 + 1, 3), // Capped at 3px max
      color: Math.random() > 0.5 ? 'rgba(0, 88, 204, ' : 'rgba(139, 92, 246, ',
      alpha: Math.min(Math.random() * 0.2 + 0.12, 0.32), // Capped under 0.35
    }))

    // Mouse repel
    let mouse = { x: -1000, y: -1000, radius: 110 }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    // Pause offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Render loop
    const render = () => {
      if (isVisible && !document.hidden) {
        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < count; i++) {
          const p = particles[i]

          // Move
          p.x += p.vx
          p.y += p.vy

          // Wrap edges
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0

          // Cursor repel
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx)
            const force = (mouse.radius - dist) / mouse.radius
            p.x -= Math.cos(angle) * force * 3.5
            p.y -= Math.sin(angle) * force * 3.5
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color + p.alpha + ')'
          ctx.fill()

          // Connect near particles
          for (let j = i + 1; j < count; j++) {
            const p2 = particles[j]
            const lineDist = Math.hypot(p.x - p2.x, p.y - p2.y)
            if (lineDist < 80) {
              const lineAlpha = (1 - lineDist / 80) * 0.12
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(0, 88, 204, ${lineAlpha})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
    }
  }, [tier])

  if (tier !== 'high') return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        maskImage: 'radial-gradient(ellipse 720px 380px at 50% 40%, transparent 25%, black 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 720px 380px at 50% 40%, transparent 25%, black 85%)',
      }}
      aria-hidden="true"
    />
  )
}
