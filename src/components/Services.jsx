'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Globe,
  Share2,
  Palette,
  TrendingUp,
  Camera,
  Target,
  Printer,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { EASINGS } from '@/lib/motion'
import BorderBeam from '@/components/motion/BorderBeam'
import Key from '@/components/ui/Key'
import { playTick } from '@/lib/sound'

const SERVICES = [
  {
    num: '01',
    title: 'Web & App Development',
    desc: 'Custom websites & mobile apps built to perform. WordPress, React, Next.js, full-stack — we engineer scalable digital experiences from concept to launch.',
    points: [
      'Custom websites & mobile apps built to perform',
      'WordPress, React, full-stack — we handle it all',
    ],
    icon: Globe,
    span: 'lg:col-span-7',
    accent: '#0058CC',
  },
  {
    num: '02',
    title: 'Social Media Marketing',
    desc: 'Content strategy & post design that converts. Community management that builds passionate, loyal brand advocates.',
    points: [
      'Content strategy & post design that converts',
      'Community management that builds loyal followers',
    ],
    icon: Share2,
    span: 'lg:col-span-5',
    accent: '#EC4899',
  },
  {
    num: '03',
    title: 'Branding & Identity',
    desc: 'Logos & visual systems that stick in memory. Stationery, typography, and luxury packaging crafted with mathematical precision.',
    points: [
      'Logos & visual systems that stick in memory',
      'Stationery & packaging done with precision',
    ],
    icon: Palette,
    span: 'lg:col-span-5',
    accent: '#8B5CF6',
  },
  {
    num: '04',
    title: 'SEO & Content Marketing',
    desc: 'Data-driven SEO that compounds over time. Sustainable organic growth you own — not rented attention that disappears when ads stop.',
    points: [
      'Data-driven SEO that compounds over time',
      'Organic growth you own — not rented attention',
    ],
    icon: TrendingUp,
    span: 'lg:col-span-7',
    accent: '#10B981',
  },
  {
    num: '05',
    title: 'Photography & Videography',
    desc: 'Food, fashion, product & interior visual production. Professional commercial visuals that elevate your brand perception and trust.',
    points: [
      'Food, fashion, product & interior shoots',
      'Professional visuals that elevate your brand',
    ],
    icon: Camera,
    span: 'lg:col-span-7',
    accent: '#06B6D4',
  },
  {
    num: '06',
    title: 'Advertising & Campaigns',
    desc: 'Meta & Google ads built for maximum return on ad spend. Rigorous creative testing and conversion funnel optimization from start to finish.',
    points: [
      'Meta & Google ads built for maximum ROI',
      'From concept to conversion — end to end',
    ],
    icon: Target,
    span: 'lg:col-span-5',
    accent: '#F59E0B',
  },
  {
    num: '07',
    title: 'Print & Packaging Design',
    desc: 'Flyers, catalogues, standees & tactile product labels. Amazon enhanced content that converts shoppers at every critical touchpoint.',
    points: [
      'Flyers, catalogues, standees & product labels',
      'Amazon listings that convert at every touchpoint',
    ],
    icon: Printer,
    span: 'lg:col-span-5',
    accent: '#6366F1',
  },
  {
    num: '08',
    title: 'Legal & Financial Services',
    desc: 'End-to-end business setup & regulatory compliance. Strategic financial guidance to ensure your brand builds on rock-solid ground.',
    points: [
      'End-to-end business setup & compliance',
      'Financial guidance to build on solid ground',
    ],
    icon: ShieldCheck,
    span: 'lg:col-span-7',
    accent: '#3B82F6',
  },
]

function ServiceCard({ service, index, onSelect }) {
  const Icon = service.icon
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  const handlePointerMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Purposeful icon micro-animations based on service type
  const getIconAnimation = () => {
    if (!isHovered) return { rotate: 0, scale: 1, y: 0, x: 0 }
    switch (service.num) {
      case '01': return { rotate: 360 }                               // Globe rotates
      case '02': return { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } // Social nodes pulse
      case '03': return { rotate: [-10, 10, -5, 5, 0] }               // Palette tilts
      case '04': return { y: [-3, 1, 0], x: [0, 3, 0] }                // Growth line surges
      case '05': return { scale: [1, 0.88, 1.12, 1] }                 // Camera shutter click
      case '06': return { scale: [1, 1.2, 0.95, 1] }                  // Target crosshair pulse
      case '07': return { y: [-2, 2, -1, 0] }                         // Printer output motion
      case '08': return { scale: [1, 1.15, 1] }                       // Shield checkmark shine
      default: return { scale: 1.1 }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      playTick()
      onSelect(service)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => {
        playTick()
        onSelect(service)
      }}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: EASINGS.easeOutExpo }}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-card
      className={`group relative overflow-hidden glass-strong rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,88,204,0.14)] border border-[rgba(0,0,0,0.08)] cursor-pointer ${service.span} col-span-1 sm:col-span-1 focus-visible:ring-2 focus-visible:ring-[#0058CC]`}
      style={{
        boxSizing: 'border-box',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Traveling Border Beam on Hover */}
      <BorderBeam
        isHovered={isHovered}
        colorFrom={service.accent}
        colorTo="#8B5CF6"
        size={180}
        duration={12}
        delay={index * 1.5}
      />

      {/* Cursor-following spotlight */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${service.accent}16, transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {/* Top row: Number on left, Physical Keycap on right */}
        <div className="flex items-start justify-between">
          <span className="text-[13px] font-mono font-bold tracking-wider text-[#6E6E73] tabular-nums mt-1">
            {service.num}
          </span>
          <div
            className="keycap w-12 h-12 rounded-[16px] flex items-center justify-center p-2.5 shrink-0 transition-all duration-300 group-hover:scale-105"
            style={{
              color: service.accent,
            }}
          >
            <motion.div
              animate={getIconAnimation()}
              transition={{ duration: 0.7, ease: EASINGS.press }}
              className="flex items-center justify-center"
            >
              <Icon
                size={22}
                strokeWidth={2}
                style={{
                  filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.85))',
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-[#1D1D1F] mt-6 leading-[1.15] group-hover:text-[#0058CC] transition-colors duration-200">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[16px] sm:text-[17px] text-[#3A3A3C] leading-[1.55] max-w-[52ch] mt-3">
          {service.desc}
        </p>
      </div>

      {/* Bullets block with sequential drawing checkmarks */}
      <div className="relative z-10 mt-8 pt-6 border-t border-[rgba(0,0,0,0.08)]">
        <ul className="grid gap-3">
          {service.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] sm:text-[16px] text-[#3A3A3C] leading-[1.5]">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.15 + i * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className="shrink-0 mt-[2px]"
              >
                <CheckCircle2
                  size={20}
                  strokeWidth={2.2}
                  className="text-[#0058CC]"
                />
              </motion.div>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    if (selectedService) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedService])

  return (
    <section id="services" className="section-pad relative z-10 bg-[var(--color-bg)]">
      <Container>
        {/* Section Header: Left aligned to Container, max-width 60ch on lead */}
        <div className="section-header max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
            className="section-header-eyebrow"
          >
            <span className="text-eyebrow">What We Offer</span>
          </motion.div>

          <h2 className="text-h2 section-header-title">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASINGS.easeOutExpo }}
              className="inline-block"
            >
              Our{' '}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASINGS.easeOutExpo }}
              className="inline-block text-[#0058CC]"
            >
              Services
            </motion.span>
          </h2>

          <p className="text-lead max-w-[60ch]">
            Integrated capabilities spanning engineering, design, and growth marketing. Built for ambitious founders who demand measurable ROI.
          </p>
        </div>

        {/* 12-column grid on desktop (7+5, 5+7 rows), 2 cols on tablet, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {SERVICES.map((s, idx) => (
            <ServiceCard
              key={s.num}
              service={s}
              index={idx}
              onSelect={setSelectedService}
            />
          ))}
        </div>

        {/* Expand-In-Place Modal Detail Panel */}
        <AnimatePresence>
          {selectedService && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={selectedService.title}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.28, ease: EASINGS.easeOutExpo }}
                className="glass-strong rounded-[32px] p-8 sm:p-10 max-w-xl w-full shadow-2xl border border-black/10 relative"
                style={{ padding: '36px', boxSizing: 'border-box' }}
              >
                {/* Close Button */}
                <div className="absolute top-6 right-6">
                  <Key
                    size="icon"
                    variant="light"
                    circle
                    onClick={() => {
                      playTick()
                      setSelectedService(null)
                    }}
                    aria-label="Close details"
                  >
                    <X size={18} strokeWidth={2.4} />
                  </Key>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[13px] font-mono font-bold text-[#6E6E73]">
                    {selectedService.num}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedService.accent }}
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] mb-4">
                  {selectedService.title}
                </h3>

                <p className="text-[16px] text-[#3A3A3C] leading-relaxed mb-6">
                  {selectedService.desc}
                </p>

                <div className="pt-6 border-t border-black/8 mb-8">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#6E6E73] mb-3">
                    Key Deliverables
                  </h4>
                  <ul className="grid gap-2.5">
                    {selectedService.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] text-[#1D1D1F]">
                        <CheckCircle2 size={18} className="text-[#0058CC] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <Key
                    href="#contact"
                    variant="accent"
                    size="lg"
                    className="w-full no-underline"
                    onClick={() => setSelectedService(null)}
                  >
                    <span>Start a Project</span>
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </Key>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}
