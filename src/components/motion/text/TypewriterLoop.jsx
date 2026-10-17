'use client'
import { useState, useEffect } from 'react'
import { useMotionTier } from '@/lib/motion'

const PHRASES = ['Websites.', 'Brands.', 'Campaigns.', 'Digital Growth.']

export default function TypewriterLoop({ className = '' }) {
  const tier = useMotionTier()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState(PHRASES[0])
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (tier === 'low') {
      setCurrentText(PHRASES[0])
      return
    }

    const currentPhrase = PHRASES[phraseIndex]
    const typeSpeed = isDeleting ? 40 : 85

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        } else {
          // Pause at full word before deleting
          setTimeout(() => setIsDeleting(true), 1800)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentPhrase.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
        }
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, phraseIndex, tier])

  return (
    <span
      className={`inline-flex items-center text-[#0058CC] font-bold ${className}`}
      aria-live="off"
      aria-label={PHRASES[phraseIndex]}
    >
      {/* Fixed min-width container to prevent horizontal layout shift */}
      <span className="inline-block min-w-[14ch] text-left">
        {currentText}
        <span className="inline-block w-[2px] h-[1em] bg-[#1A73E8] ml-1 align-middle animate-pulse" aria-hidden="true" />
      </span>
    </span>
  )
}
