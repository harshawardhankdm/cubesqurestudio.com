'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Magnetic, CountUp, EASINGS, useMotionTier } from '@/lib/motion'
import Key from '@/components/ui/Key'
import Tesseract from '@/components/hero/Tesseract'
import HeroParticles from '@/components/HeroParticles'
import HeroSatellites from '@/components/HeroSatellites'
import HeroMorphBlob from '@/components/HeroMorphBlob'
import { TypewriterLoop } from '@/components/motion/text'
import ArrowMorph from '@/components/motion/ArrowMorph'

const STATS = [
  { value: 200, suffix: '+', label: 'Projects Done', strokePercent: 92 },
  { value: 50,  suffix: '+', label: 'Happy Clients', strokePercent: 88 },
  { value: 6,   suffix: '+', label: 'Years Active', strokePercent: 78 },
]

export default function Hero() {
  const tier = useMotionTier()
  const { scrollY } = useScroll()
  const [isBtn1Hovered, setIsBtn1Hovered] = useState(false)
  const [isBtn2Hovered, setIsBtn2Hovered] = useState(false)

  // Decorative scroll cue fade only (does not affect any text or buttons)
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0])

  // Status pill flip state (every 5 seconds)
  const [pillState, setPillState] = useState(0) // 0: accepting clients, 1: pune local time
  const [puneTime, setPuneTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Convert to IST (UTC+5:30)
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      setPuneTime(`Pune \u00B7 ${istString} IST`)
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 30000)
    const pillInterval = setInterval(() => {
      setPillState((prev) => (prev === 0 ? 1 : 0))
    }, 5000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(pillInterval)
    }
  }, [])

  return (
    <section
      id="main-content"
      className="relative min-h-[96svh] flex flex-col justify-center items-center overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28"
    >
      {/* Interactive 2D Canvas Particle Field (High Tier) */}
      <HeroParticles />

      {/* Restrained Single Ambient Aurora Glow */}
      <span
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[90vw] h-[360px] bg-gradient-to-tr from-[#0058CC]/14 via-[#8B5CF6]/10 to-transparent blur-[100px] rounded-full block"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <div className="flex flex-col items-center w-full">
          {/* Headline and Hero Center Zone (Zero scroll-opacity reduction) */}
          <div className="flex flex-col items-center w-full">
            {/* Status Pill Badge with Real Inset LED & Vertical Roll */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
              className="mb-5 sm:mb-7"
            >
              <div className="glass-pill relative inline-flex items-center gap-2.5 px-5 py-2 text-[13px] font-medium text-[#5E5E63] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.06)] min-h-[36px]">
                <span className="led-dot animate-pulse" />
                <div className="min-w-[180px] sm:min-w-[210px] text-left overflow-hidden h-[20px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pillState}
                      initial={{ y: 14 }}
                      animate={{ y: 0 }}
                      exit={{ y: -14 }}
                      transition={{ duration: 0.28, ease: EASINGS.easeOutExpo }}
                      className="whitespace-nowrap"
                    >
                      {pillState === 0 ? (
                        <span className="text-[#1D1D1F] font-semibold">
                          Currently Accepting Clients
                        </span>
                      ) : (
                        <span className="text-[#0058CC] font-mono font-semibold tabular-nums">
                          {puneTime || 'Pune \u00B7 Studio Active'}
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Eyebrow with Typewriter service loop */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASINGS.easeOutExpo }}
              className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-eyebrow">
                Creative Digital Agency &bull;
              </span>
              <TypewriterLoop className="text-[12px] tracking-wider uppercase" />
            </motion.div>

            {/* Hero Headline: Progressive reveals + gradient liquid shimmer */}
            <div className="w-full max-w-[1020px] mb-6 sm:mb-8">
              <h1 className="text-hero">
                <motion.span
                  initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.16, ease: EASINGS.easeOutExpo }}
                  className="block text-[#1D1D1F]"
                >
                  We turn bold visions into
                </motion.span>
                <motion.span
                  initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay: 0.24, ease: EASINGS.easeOutExpo }}
                  className="block"
                >
                  <span className="relative inline-block font-extrabold bg-gradient-to-r from-[#0058CC] via-[#1A73E8] to-[#8B5CF6] bg-clip-text text-transparent animate-text-shimmer">
                    measurable results.
                  </span>
                </motion.span>
              </h1>
            </div>

            {/* Lead description: Plain fully-contrasted text with one-time entrance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: EASINGS.easeOutExpo }}
              className="mb-6 sm:mb-8 max-w-2xl mx-auto"
            >
              <p className="text-lead text-[18px] sm:text-[20px] leading-[1.55] max-w-[60ch] mx-auto text-[#3A3A3C]">
                A boutique of digital art — not a factory. We deliver personalized brand strategy, high-converting web platforms, and organic growth for brands that refuse to blend in.
              </p>
            </motion.div>

            {/* 4D Tesseract Canvas with Morphing Glow & Orbiting Satellites */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.36, ease: EASINGS.easeOutExpo }}
              className="relative flex items-center justify-center my-3 w-full"
            >
              <HeroMorphBlob />
              <HeroSatellites />
              <Tesseract />
            </motion.div>
          </div>

          {/* Buttons Zone: Physical Skeuomorphic Keys (Always 100% full opacity while visible) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: EASINGS.easeOutExpo }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-16 sm:mb-20 mt-4"
          >
            <Magnetic strength={0.28}>
              <Key
                href="#work"
                variant="accent"
                size="lg"
                onMouseEnter={() => setIsBtn1Hovered(true)}
                onMouseLeave={() => setIsBtn1Hovered(false)}
                className="w-full sm:w-auto"
              >
                <span>See Our Work</span>
                <ArrowMorph
                  type="horizontal"
                  size={18}
                  strokeWidth={2.4}
                  isHovered={isBtn1Hovered}
                />
              </Key>
            </Magnetic>

            <Magnetic strength={0.22}>
              <Key
                href="#contact"
                variant="light"
                size="lg"
                onMouseEnter={() => setIsBtn2Hovered(true)}
                onMouseLeave={() => setIsBtn2Hovered(false)}
                className="w-full sm:w-auto"
              >
                <span>Start a Project</span>
                <ArrowMorph
                  type="diagonal"
                  size={17}
                  strokeWidth={2.2}
                  isHovered={isBtn2Hovered}
                />
              </Key>
            </Magnetic>
          </motion.div>

          {/* Real Stats Row (Always 100% opacity, glass-strong opaque fill, dark numbers, clear spacing) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56, ease: EASINGS.easeOutExpo }}
            className="w-full max-w-3xl pt-8 border-t border-[rgba(0,0,0,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="glass-strong relative overflow-hidden p-6 sm:p-7 rounded-[24px] flex flex-col items-center hover:-translate-y-1 transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Reserved progress arc space above numbers to prevent intersection */}
                <div className="w-full h-7 flex justify-center mb-1">
                  <svg
                    className="w-24 h-7 pointer-events-none opacity-40"
                    viewBox="0 0 100 28"
                  >
                    <motion.path
                      d="M 10,24 A 40,40 0 0,1 90,24"
                      fill="none"
                      stroke="#0058CC"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: s.strokePercent / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: EASINGS.easeOutExpo }}
                    />
                  </svg>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1D1D1F] leading-none mb-2 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                  <CountUp to={s.value} suffix="" duration={1.3} />
                  <span className="text-[#0058CC]">{s.suffix}</span>
                </div>
                <div className="text-[15px] font-medium text-[#3A3A3C]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Floating Subtle Scroll Cue */}
          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="mt-12 hidden sm:flex flex-col items-center gap-1.5 text-[#5E5E63] text-[12px] font-medium tracking-wider uppercase pointer-events-none"
          >
            <span>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={15} />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
