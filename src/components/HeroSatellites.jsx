'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

const SATELLITES = [
  { id: 'web',    label: 'Web',    color: '#0058CC', phase: 0,                 desc: 'High-Performance Apps' },
  { id: 'brand',  label: 'Brand',  color: '#8B5CF6', phase: Math.PI / 2,        desc: 'Visual Systems' },
  { id: 'social', label: 'Social', color: '#EC4899', phase: Math.PI,            desc: 'Organic Growth' },
  { id: 'seo',    label: 'SEO',    color: '#10B981', phase: (3 * Math.PI) / 2,  desc: 'Search Visibility' },
]

export default function HeroSatellites() {
  const tier = useMotionTier()
  const [hoveredId, setHoveredId] = useState(null)
  const [coords, setCoords] = useState(() =>
    SATELLITES.map((s) => {
      const rx = 195
      const ry = 90
      const x = Math.cos(s.phase) * rx
      const y = Math.sin(s.phase) * ry
      const isBehind = Math.sin(s.phase) < 0
      const scale = isBehind ? 0.85 : 1
      const zIndex = isBehind ? 5 : 25
      return { x, y, scale, zIndex }
    })
  )

  const angleRef = useRef(0)
  const isHoveredRef = useRef(false)
  isHoveredRef.current = hoveredId !== null

  useEffect(() => {
    if (tier === 'low') return

    let animId
    let lastTime = performance.now()

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime

      if (!isHoveredRef.current) {
        // Orbit speed: 1 full rotation every 26 seconds
        angleRef.current += delta * ((2 * Math.PI) / 26)
      }

      const isMobile = window.innerWidth < 640
      const rx = isMobile ? 140 : 210
      const ry = isMobile ? 65 : 95

      const nextCoords = SATELLITES.map((s) => {
        const theta = angleRef.current + s.phase
        const x = Math.cos(theta) * rx
        const y = Math.sin(theta) * ry
        const sinT = Math.sin(theta)
        const isBehind = sinT < 0
        // Front is 1.0, back shrinks to 0.85
        const scale = 0.85 + 0.15 * ((sinT + 1) / 2)
        const zIndex = isBehind ? 5 : 25

        return { x, y, scale, zIndex }
      })

      setCoords(nextCoords)
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [tier])

  if (tier === 'low') return null

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible"
      style={{ backfaceVisibility: 'visible' }}
      aria-hidden="true"
    >
      {SATELLITES.map((sat, i) => {
        const isHovered = hoveredId === sat.id
        const pos = coords[i] || { x: 0, y: 0, scale: 1, zIndex: 20 }

        return (
          <div
            key={sat.id}
            onMouseEnter={() => setHoveredId(sat.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="pointer-events-auto absolute cursor-pointer select-none group"
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) scale(${pos.scale})`,
              zIndex: isHovered ? 50 : pos.zIndex,
              backfaceVisibility: 'visible',
              transition: isHovered ? 'none' : 'transform 100ms linear',
            }}
          >
            {/* Skeuomorphic Mini Light Keycap Chip */}
            <div
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[14px] text-[#1D1D1F] tracking-tight group-hover:scale-105 transition-transform duration-200"
              style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F0F0F4 50%, #E2E2E8 100%)',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow:
                  'inset 1px 1px 0 rgba(255, 255, 255, 1), inset -1px -1px 0 rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)',
                opacity: 1,
              }}
            >
              {/* Service Color Glowing LED Dot */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: sat.color,
                  boxShadow: `0 0 6px ${sat.color}, inset 0 0.5px 0 rgba(255,255,255,0.8)`,
                }}
              />
              <span className="leading-none text-[#1D1D1F]">{sat.label}</span>
            </div>

            {/* Context Tooltip on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-[#1D1D1F] whitespace-nowrap z-50 pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.96)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.14)',
                  }}
                >
                  {sat.desc}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
