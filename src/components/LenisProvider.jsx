'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { useAnimationCapabilities } from '@/lib/motion'

export default function LenisProvider({ children }) {
  const { reducedMotion } = useAnimationCapabilities()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    // Handle internal anchor links with smooth scroll offset
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (!target) return
      const hash = target.getAttribute('href')
      if (hash && hash !== '#') {
        const element = document.querySelector(hash)
        if (element) {
          e.preventDefault()
          lenis.scrollTo(element, { offset: -80 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    let animationFrameId
    function raf(time) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }
    animationFrameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animationFrameId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
