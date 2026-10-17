'use client'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Volume2, VolumeX } from 'lucide-react'
import { getSoundEnabled, setSoundEnabled, playTick } from '@/lib/sound'

export default function SoundToggle({ className = '' }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getSoundEnabled())
  }, [])

  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)
    setSoundEnabled(next)
    if (next) {
      setTimeout(() => playTick(), 50)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Toggle UI interaction sounds"
      onClick={handleToggle}
      className={`group relative inline-flex items-center gap-2 cursor-pointer select-none rounded-full px-3 py-1.5 transition-all ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Recessed Track */}
      <div
        className="relative w-10 h-5 rounded-full transition-colors duration-200"
        style={{
          background: enabled ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.08)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Metallic / Glass Thumb with Rim Light & Drop Shadow */}
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E8E8ED 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1.5px 0 rgba(0, 0, 0, 0.15), 0 1.5px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Micro indicator LED */}
          {enabled && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
              style={{
                boxShadow: '0 0 4px #10B981, 0 0 8px rgba(16, 185, 129, 0.8)',
              }}
            />
          )}
        </motion.div>
      </div>

      <span className="text-[12px] font-semibold text-[#5E5E63] group-hover:text-[#1D1D1F] flex items-center gap-1 transition-colors">
        {enabled ? (
          <>
            <Volume2 size={13} className="text-[#10B981]" />
            <span>Audio On</span>
          </>
        ) : (
          <>
            <VolumeX size={13} className="text-[#5E5E63]" />
            <span>Audio Off</span>
          </>
        )}
      </span>
    </button>
  )
}
