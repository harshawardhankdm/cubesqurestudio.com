'use client'
import { useState, useEffect, useRef } from 'react'
import { useMotionTier } from '@/lib/motion'

const GLYPHS = '01#*+~/_[]{}<>'

export default function ScrambleText({
  text,
  className = '',
  duration = 700,
  triggerOnHover = false,
  as = 'span',
}) {
  const tier = useMotionTier()
  const [displayText, setDisplayText] = useState(text)
  const isScrambling = useRef(false)
  const ref = useRef(null)

  const scramble = () => {
    if (isScrambling.current || tier === 'low') return
    isScrambling.current = true

    const length = text.length
    const startTime = performance.now()

    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const resolvedIndex = Math.floor(progress * length)

      let result = ''
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          result += ' '
        } else if (i < resolvedIndex) {
          result += text[i]
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }

      setDisplayText(result)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplayText(text)
        isScrambling.current = false
      }
    }

    requestAnimationFrame(step)
  }

  useEffect(() => {
    if (tier === 'low') {
      setDisplayText(text)
      return
    }

    if (!triggerOnHover) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            scramble()
            observer.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [text, tier, triggerOnHover])

  const Component = as

  return (
    <Component
      ref={ref}
      aria-label={text}
      onMouseEnter={triggerOnHover ? scramble : undefined}
      className={`font-mono tabular-nums ${className}`}
    >
      {displayText}
    </Component>
  )
}
