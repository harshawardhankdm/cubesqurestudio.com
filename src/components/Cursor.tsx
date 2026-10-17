'use client'
import { useEffect } from 'react'
import { useMotionTier } from '@/lib/motion'
import { CursorEngine } from '@/lib/cursor/engine'

export default function Cursor() {
  const tier = useMotionTier()

  useEffect(() => {
    // Mount the framework-agnostic engine only in client after hydration
    const engine = new CursorEngine({ tier })
    engine.init()

    return () => {
      engine.destroy()
    }
  }, [tier])

  // Renders nothing on server to prevent any hydration mismatch
  return null
}
