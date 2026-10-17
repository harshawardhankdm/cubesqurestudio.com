'use client'
import { motion } from 'motion/react'
import { useMotionTier, EASINGS } from '@/lib/motion'

export default function SplitReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as = 'div',
}) {
  const tier = useMotionTier()
  const Component = motion[as] || motion.div

  if (tier === 'low') {
    const Tag = as
    return <Tag className={className}>{text}</Tag>
  }

  const words = text.split(' ')

  return (
    <Component
      aria-label={text}
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          <motion.span
            variants={{
              hidden: {
                opacity: 0,
                y: 18,
                rotateX: 20,
                filter: 'blur(6px)',
              },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.65,
                  ease: EASINGS.easeOutExpo,
                },
              },
            }}
            className="inline-block transform-gpu"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  )
}
