'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { TextRoll } from '@/components/motion/text'
import RippleEffect from '@/components/motion/RippleEffect'
import Key from '@/components/ui/Key'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work'     },
  { label: 'Process',  href: '#process'  },
  { label: 'Contact',  href: '#contact'  },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [theme, setTheme] = useState('light') // 'light' | 'dark'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const mobileRef = useRef(null)

  // Track scroll progress for the top 2px progress line and pill compression
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver for active section link & dark theme detection
  useEffect(() => {
    const sectionIds = ['services', 'work', 'process', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            const isDark = entry.target.getAttribute('data-nav-theme') === 'dark'
            setTheme(isDark ? 'dark' : 'light')
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Lock body scroll and trap ESC on mobile menu
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [mobileOpen])

  const isDark = theme === 'dark'

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top of Viewport 2px Full-Width Scroll Progress Bar with Glowing Head */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none overflow-hidden bg-transparent">
        <motion.div
          style={{ width: `${scrollProgress}%` }}
          className="relative h-full bg-gradient-to-r from-[#0058CC] via-[#2B8CFF] to-[#8B5CF6] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,88,204,0.6)]"
        >
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#60A5FA]" />
        </motion.div>
      </div>

      {/* Floating Pill Nav */}
      <div className="fixed top-3 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.header
          initial={{ y: -28, opacity: 0, filter: 'blur(8px)' }}
          animate={{
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: scrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto transition-colors duration-300 ease-out flex items-center justify-between gap-6 w-full max-w-[1120px] h-[56px] sm:h-[60px] rounded-full pl-5 pr-2 ${
            isDark
              ? 'bg-[#141418]/88 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)]'
              : 'bg-white/90 border border-black/8 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.05),0_10px_36px_rgba(0,0,0,0.08)]'
          } backdrop-blur-[24px] backdrop-saturate-[180%]`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Logo Group */}
          <Link
            href="/"
            onClick={(e) => {
              if (typeof window !== 'undefined') {
                const now = Date.now()
                if (!window.__lastLogoClickTime || now - window.__lastLogoClickTime > 600) {
                  window.__logoClickCount = 1
                } else {
                  window.__logoClickCount = (window.__logoClickCount || 1) + 1
                  if (window.__logoClickCount === 3) {
                    window.dispatchEvent(new CustomEvent('cubesquare_logo_egg'))
                    window.__logoClickCount = 0
                  }
                }
                window.__lastLogoClickTime = now
              }
            }}
            className="flex items-center gap-2.5 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058CC] rounded-full py-1 shrink-0"
            aria-label="Cubesquare Studio Home"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105 border border-black/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/cubesquarestudioicon.png"
                alt="Cubesquare Studio Icon"
                width={32}
                height={32}
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span
                className={`text-[15px] font-bold tracking-tight leading-none transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-[#1D1D1F]'
                }`}
              >
                Cube<span className={isDark ? 'text-[#8CC2FF]' : 'text-[#0058CC]'}>square</span>
              </span>
              <span
                className={`text-[11px] font-semibold tracking-[0.12em] uppercase mt-0.5 transition-colors duration-300 ${
                  isDark ? 'text-[#B0B0B6]' : 'text-[#5E5E63]'
                }`}
              >
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const targetId = link.href.slice(1)
              const isActive = active === targetId

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('nav_target_highlight', { detail: { id: targetId } }))
                    }
                  }}
                  className={`relative min-h-[44px] px-[18px] py-2.5 rounded-full text-[15px] font-medium leading-none whitespace-nowrap transition-colors duration-200 flex items-center justify-center select-none ${
                    isActive
                      ? isDark
                        ? 'text-white font-semibold'
                        : 'text-[#0058CC] font-semibold'
                      : isDark
                      ? 'text-[#F5F5F7]/80 hover:text-white'
                      : 'text-[#1D1D1F]/75 hover:text-[#1D1D1F]'
                  }`}
                  style={{
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Physical Pressed-in Recessed Key Capsule for Active Link */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-capsule"
                      className="absolute inset-0 rounded-full -z-10 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    >
                      <span className="nav-tab-recessed">
                        <span className={`nav-tab-cap ${isDark ? 'nav-tab-cap--dark' : ''}`} />
                      </span>
                    </motion.span>
                  )}
                  <TextRoll active={isActive}>{link.label}</TextRoll>
                </a>
              )
            })}
          </nav>

          {/* Right Action: CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 pr-1 shrink-0">
            <Key
              href="#contact"
              variant="accent"
              size="sm"
              className="no-underline"
            >
              <span>Let&apos;s talk</span>
              <ArrowUpRight size={15} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Key>

            <div className="md:hidden">
              <Key
                size="icon"
                variant={isDark ? 'graphite' : 'light'}
                circle
                onClick={() => setMobileOpen(true)}
                aria-label="Open mobile navigation"
              >
                <Menu size={18} strokeWidth={2} />
              </Key>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div
            ref={mobileRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-black/40 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong rounded-[28px] p-6 sm:p-8 flex flex-col justify-between max-w-md w-full mx-auto my-auto shadow-2xl border border-black/10"
              style={{ padding: '32px', boxSizing: 'border-box' }}
            >
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between pb-6 border-b border-black/8">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src="/images/cubesquarestudioicon.png"
                      alt="Cubesquare Studio"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[16px] font-bold text-[#1D1D1F]">
                    Cube<span className="text-[#0058CC]">square</span>
                  </span>
                </div>

                <Key
                  size="icon"
                  variant="light"
                  circle
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={2} />
                </Key>
              </div>

              {/* Navigation Links with large font and 8px gaps */}
              <nav className="flex flex-col gap-2 py-8">
                {NAV_LINKS.map((link) => {
                  const targetId = link.href.slice(1)
                  const isActive = active === targetId

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-[24px] sm:text-[26px] font-semibold tracking-tight py-2.5 px-4 rounded-2xl transition-colors no-underline ${
                        isActive
                          ? 'bg-[#0058CC]/10 text-[#0058CC]'
                          : 'text-[#1D1D1F] hover:bg-black/5'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </nav>

              {/* Bottom CTA & Direct Line */}
              <div className="pt-6 border-t border-black/8 flex flex-col gap-3">
                <Key
                  href="#contact"
                  variant="accent"
                  size="lg"
                  className="w-full no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Start a project</span>
                  <ArrowUpRight size={16} strokeWidth={2} />
                </Key>
                <p className="text-center text-[13px] text-[#5E5E63]">
                  Pune, India &bull; +91 79724 24480
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
