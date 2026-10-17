'use client'
import { useState, useEffect } from 'react'
import { useMotionTier, MOTION_CONFIG } from '@/lib/motion'

export default function MotionDebugPanel() {
  const tier = useMotionTier()
  const [isEnabled, setIsEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [fps, setFps] = useState(60)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('motion') === 'debug' || process.env.NODE_ENV === 'development') {
      setIsEnabled(true)
    }

    // Measure live FPS
    let frameCount = 0
    let lastTime = performance.now()
    let animId

    const countFps = (now) => {
      frameCount++
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)))
        frameCount = 0
        lastTime = now
      }
      animId = requestAnimationFrame(countFps)
    }

    animId = requestAnimationFrame(countFps)
    return () => cancelAnimationFrame(animId)
  }, [])

  if (!isEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-[99999] font-mono text-[11px] select-none">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-lg bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-xl cursor-pointer hover:bg-black flex items-center gap-2"
          style={{ paddingLeft: '16px', paddingRight: '16px', boxSizing: 'border-box' }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tier: {tier}</span>
          <span className="text-white/60">| {fps} fps</span>
        </button>
      ) : (
        <div className="w-64 p-4 rounded-2xl bg-black/90 text-white backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Motion Debug
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white cursor-pointer px-1"
            >
              &times;
            </button>
          </div>

          <div className="flex justify-between items-center text-white/70">
            <span>Hardware Tier:</span>
            <span className="font-bold text-[#60A5FA] uppercase">{tier}</span>
          </div>

          <div className="flex justify-between items-center text-white/70">
            <span>FPS:</span>
            <span className={`font-bold ${fps >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {fps}
            </span>
          </div>

          <div className="flex justify-between items-center text-white/70">
            <span>Speed Multiplier:</span>
            <span className="text-white">{MOTION_CONFIG.MOTION_SPEED}x</span>
          </div>

          <div className="flex justify-between items-center text-white/70">
            <span>Intensity:</span>
            <span className="text-white">{MOTION_CONFIG.MOTION_INTENSITY * 100}%</span>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-white/40">
            Tune globally in src/lib/motion.js
          </div>
        </div>
      )}
    </div>
  )
}
