'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import Key from '@/components/ui/Key'
import { playTick } from '@/lib/sound'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setProgress(scrollY / totalHeight)
      }
      setVisible(scrollY > window.innerHeight * 1.2)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    playTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Circular progress math
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Ring Around the Bezel */}
            <svg
              className="absolute -inset-1.5 w-[56px] h-[56px] -rotate-90 pointer-events-none z-10"
              viewBox="0 0 56 56"
            >
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-black/10"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-[#0058CC] transition-all duration-100 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <Key
              size="icon"
              variant="light"
              circle
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group"
            >
              <ArrowUp
                size={18}
                strokeWidth={2.4}
                className="text-[#1D1D1F] group-hover:text-[#0058CC] group-hover:-translate-y-0.5 transition-all"
              />
            </Key>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
