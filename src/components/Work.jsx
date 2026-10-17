'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { TiltCard, EASINGS } from '@/lib/motion'
import WorkImageDistortion from '@/components/WorkImageDistortion'
import ArrowMorph from '@/components/motion/ArrowMorph'
import Key from '@/components/ui/Key'

const WORKS = [
  {
    name: 'Pretty Bee',
    type: 'E-Commerce Website',
    label: 'E-COMMERCE',
    image: '/images/pretty-bee.png',
  },
  {
    name: 'EMbox',
    type: 'Social Media + Branding',
    label: 'SOCIAL',
    image: '/images/embox.png',
  },
  {
    name: "Nikam's Organics",
    type: 'Brand Identity + Packaging',
    label: 'BRANDING',
    image: '/images/nikams-organics.png',
  },
  {
    name: 'Carnival Resort',
    type: 'Website + Social Media',
    label: 'WEBSITE',
    image: '/images/carnival-resorts.png',
  },
  {
    name: 'Monsoon Dance Co.',
    type: 'Social Media Marketing',
    label: 'SOCIAL',
    image: '/images/monsoon-dance.png',
  },
  {
    name: 'Saarrthi Realty',
    type: 'Digital Marketing + Web',
    label: 'DIGITAL',
    image: '/images/sarrthi-reality.png',
  },
]

function WorkCard({ work, index, hoveredIndex, setHoveredIndex }) {
  const isHovered = hoveredIndex === index
  const isSiblingHovered = hoveredIndex !== null && !isHovered

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASINGS.easeOutExpo }}
      animate={{ opacity: isSiblingHovered ? 0.78 : 1 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="transition-opacity duration-300"
    >
      <TiltCard
        data-card
        maxTilt={6}
        className="group flex flex-col justify-between p-5 sm:p-6 rounded-[28px] glass-strong border border-[rgba(0,0,0,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_44px_rgba(0,88,204,0.18)] transition-all duration-300 cursor-pointer"
        style={{
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Artwork container with liquid distortion */}
        <WorkImageDistortion
          src={work.image}
          alt={`${work.name} - ${work.type}`}
          label={work.label}
        />

        {/* Card footer caption bar sitting inside the card below image */}
        <div className="pt-4 sm:pt-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight leading-tight group-hover:text-[#0058CC] transition-colors">
              {work.name}
            </h3>
            <span className="text-[13px] font-medium text-[#5E5E63] mt-1 block">
              {work.type}
            </span>
          </div>

          <Key
            size="icon"
            variant={isHovered ? 'accent' : 'light'}
            circle
            aria-label={`View ${work.name}`}
            className="shrink-0"
          >
            <ArrowMorph
              type="diagonal"
              size={18}
              strokeWidth={2.4}
              isHovered={isHovered}
            />
          </Key>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Work() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const activeCount = hoveredIndex !== null ? hoveredIndex + 1 : 1

  return (
    <section id="work" className="section-pad relative z-10 bg-[var(--color-bg)]">
      <Container>
        {/* Section Header with progressive reveals & ScrollHighlight */}
        <div className="section-header max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
            className="section-header-eyebrow"
          >
            <span className="text-eyebrow">Selected Work</span>
          </motion.div>

          <h2 className="text-h2 section-header-title">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASINGS.easeOutExpo }}
              className="inline-block"
            >
              What We&apos;ve{' '}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASINGS.easeOutExpo }}
              className="inline-block text-[#0058CC]"
            >
              Built
            </motion.span>
          </h2>

          <p className="text-lead max-w-[60ch]">
            A selection of brands we&apos;ve helped grow through design, strategy &amp; digital execution.
          </p>
        </div>

        {/* Grid: 6 projects with 3D tilt & liquid distortion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {WORKS.map((work, idx) => (
            <WorkCard
              key={work.name}
              work={work}
              index={idx}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </div>

        {/* Gallery Progress indicator & thin progress bar */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-mono font-bold text-[#0058CC]">
              {String(activeCount).padStart(2, '0')}
            </span>
            <span className="text-[13px] font-mono text-[#5E5E63]">/ 06 Projects</span>
          </div>

          <div className="w-full sm:w-64 h-[3px] bg-black/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0058CC] to-[#8B5CF6] rounded-full"
              animate={{ width: `${(activeCount / WORKS.length) * 100}%` }}
              transition={{ duration: 0.35, ease: EASINGS.easeOutExpo }}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
