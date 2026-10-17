'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Search, Compass, Sparkles, Rocket, TrendingUp } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { TiltCard, EASINGS } from '@/lib/motion'
import {
  DiscoveryIllustration,
  StrategyIllustration,
  CreationIllustration,
  LaunchIllustration,
  GrowIllustration,
} from '@/components/ProcessIllustrations'

const STEPS = [
  {
    num: '01',
    title: 'Discovery',
    point: 'Understand your brand, audience & goals before we touch anything.',
    icon: Search,
    color: '#3B82F6',
  },
  {
    num: '02',
    title: 'Strategy',
    point: 'Custom roadmap built around your budget — approved by you upfront.',
    icon: Compass,
    color: '#8B5CF6',
  },
  {
    num: '03',
    title: 'Creation',
    point: 'Design & development crafted with obsessive attention to detail.',
    icon: Sparkles,
    color: '#EC4899',
  },
  {
    num: '04',
    title: 'Launch',
    point: 'On-time delivery with full handover, training & support included.',
    icon: Rocket,
    color: '#10B981',
  },
  {
    num: '05',
    title: 'Grow',
    point: 'Ongoing optimization & scaling — we are your long-term partner.',
    icon: TrendingUp,
    color: '#06B6D4',
  },
]

export default function Process() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef([])

  useEffect(() => {
    const observers = STEPS.map((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i)
        },
        { rootMargin: '-30% 0px -40% 0px' }
      )
      if (stepRefs.current[i]) observer.observe(stepRefs.current[i])
      return observer
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section
      id="process"
      data-nav-theme="dark"
      className="section-pad relative bg-[#0A0A0C] text-white overflow-hidden transition-colors duration-300"
    >
      {/* Ambient Dark Accent Glow that shifts color with activeStep (masked & soft so it never washes text) */}
      <span
        className="pointer-events-none absolute top-1/4 right-0 w-[550px] h-[550px] blur-[150px] rounded-full block transition-colors duration-700 opacity-60"
        style={{
          backgroundColor: `${STEPS[activeStep]?.color || '#3B82F6'}12`,
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
              className="section-header-eyebrow"
            >
              <span className="text-[13px] font-semibold text-[#8CC2FF] uppercase tracking-[0.12em]">
                How we work
              </span>
            </motion.div>

            <h2 className="text-h2 section-header-title">
              <span className="text-[#F5F5F7]">Our </span>
              <span className="bg-gradient-to-r from-[#9CCBFF] to-[#CFE4FF] bg-clip-text text-transparent">
                Process
              </span>
            </h2>
            <p className="text-[18px] sm:text-[19px] text-[#B8B8BF] leading-[1.6] mb-8 max-w-[50ch]">
              A proven 5-step approach that takes your brand from idea to execution — with zero guesswork.
            </p>

            {/* Quick Step Indicators (Desktop) - mini graphite keys */}
            <div className="hidden lg:flex flex-col gap-3 pt-6 border-t border-white/10">
              {STEPS.map((s, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      stepRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                    className={`flex items-center gap-3.5 py-2 px-3.5 rounded-xl text-left cursor-pointer transition-all duration-200 select-none ${
                      isActive
                        ? 'text-[#F5F5F7] font-semibold translate-x-1.5'
                        : 'text-[#A1A1A8] hover:text-[#F5F5F7]'
                    }`}
                    style={{ paddingLeft: '14px', paddingRight: '14px', boxSizing: 'border-box' }}
                  >
                    <span
                      className={`text-[15px] font-mono font-semibold px-2.5 py-1 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0058CC] text-white shadow-[0_0_14px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]'
                          : 'bg-[#202026] text-[#C7C7CC] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.4)]'
                      }`}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff] animate-pulse" />}
                      {s.num}
                    </span>
                    <span className="text-[16px]">{s.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Scrolling Step Cards with Connecting Glowing Progress Line */}
          <div className="lg:col-span-7 relative flex flex-col gap-6 sm:gap-7 lg:pl-6">
            {/* Glowing vertical spine on desktop */}
            <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-[2px] bg-white/10 rounded-full">
              <motion.div
                className="w-full bg-gradient-to-b from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                animate={{
                  height: `${((activeStep + 1) / STEPS.length) * 100}%`,
                }}
                transition={{ duration: 0.45, ease: EASINGS.easeOutExpo }}
              />
              {/* Traveling light pulse node */}
              <motion.div
                className="absolute w-2 h-2 -left-[3px] rounded-full bg-white shadow-[0_0_8px_#3B82F6]"
                animate={{
                  top: `${((activeStep + 0.5) / STEPS.length) * 100}%`,
                }}
                transition={{ duration: 0.45, ease: EASINGS.easeOutExpo }}
              />
            </div>

            {STEPS.map((s, i) => {
              const isActive = activeStep === i
              const Icon = s.icon

              return (
                <div
                  key={s.num}
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  className={`transition-all duration-400 ease-out ${
                    isActive ? 'lg:translate-x-2' : ''
                  }`}
                >
                  <TiltCard
                    data-card
                    maxTilt={4}
                    className={`glass-dark p-7 sm:p-9 rounded-[28px] transition-all duration-300 border opacity-100 ${
                      isActive
                        ? 'border-[#3B82F6]/60 shadow-[0_20px_50px_rgba(59,130,246,0.25)] scale-[1.01]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(20, 20, 24, 0.88)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight transition-colors duration-300 ${
                        isActive ? 'text-[#8CC2FF]' : 'text-[#A1A1A8]'
                      }`}>
                        {s.num}
                      </span>
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-[#0058CC] text-white shadow-[0_0_20px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]'
                            : 'bg-[#202026] border border-white/10 text-[#C7C7CC]'
                        }`}
                      >
                        <Icon size={22} strokeWidth={2} />
                      </div>
                    </div>

                    <h3 className="text-[28px] sm:text-[32px] font-semibold text-[#F5F5F7] tracking-tight mb-2">
                      {s.title}
                    </h3>

                    <p className={`text-[17px] sm:text-[18px] leading-[1.6] mb-4 transition-colors duration-300 ${
                      isActive ? 'text-[#F5F5F7]' : 'text-[#A1A1A8]'
                    }`}>
                      {s.point}
                    </p>

                    {/* Contextual Micro-Illustration */}
                    <div className="pt-3 border-t border-white/10">
                      {i === 0 && <DiscoveryIllustration isActive={isActive} />}
                      {i === 1 && <StrategyIllustration isActive={isActive} />}
                      {i === 2 && <CreationIllustration isActive={isActive} />}
                      {i === 3 && <LaunchIllustration isActive={isActive} />}
                      {i === 4 && <GrowIllustration isActive={isActive} />}
                    </div>
                  </TiltCard>
                </div>
              )
            })}
          </div>

        </div>
      </Container>
    </section>
  )
}
