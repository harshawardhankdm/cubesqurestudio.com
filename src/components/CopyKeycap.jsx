'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Copy, Check } from 'lucide-react'
import Key from '@/components/ui/Key'
import { playTick } from '@/lib/sound'

export default function CopyKeycap({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    playTick()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback
    }
  }

  return (
    <Key
      size="icon"
      variant="light"
      onClick={handleCopy}
      aria-label={`${label}: ${text}`}
      className="shrink-0 ml-auto"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-1 text-[#10B981] text-[12px] font-semibold"
          >
            <Check size={14} strokeWidth={2.6} />
            <span className="hidden sm:inline">Copied</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center justify-center text-[#5E5E63]"
          >
            <Copy size={15} strokeWidth={2.2} />
          </motion.div>
        )}
      </AnimatePresence>
    </Key>
  )
}
