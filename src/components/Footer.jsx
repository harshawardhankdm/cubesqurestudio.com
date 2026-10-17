'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { EASINGS } from '@/lib/motion'
import SoundToggle from '@/components/SoundToggle'
import Key from '@/components/ui/Key'

const FOOTER_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work'     },
  { label: 'Process',  href: '#process'  },
  { label: 'Contact',  href: '#contact'  },
]

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/cubesquarestudio',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/cubesquare-studio-6a1180248/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bw79vUPvUTji3x0RSIvrwsQ%3D%3D',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/cubesquarestudio',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@cubesquarestudio',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-10 border-t border-[rgba(0,0,0,0.06)] bg-white/60 backdrop-blur-xl pt-16 sm:pt-20 pb-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-[rgba(0,0,0,0.06)]">
          {/* Logo & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
            className="flex items-center gap-3.5"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-black/5">
              <Image
                src="/images/cubesquarestudioicon.png"
                alt="Cubesquare Studio"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-[16px] font-bold tracking-tight text-[#1D1D1F]">
                Cube<span className="text-[#0058CC]">square</span> Studio
              </div>
              <div className="text-[13px] text-[#5E5E63]">
                Boutique Digital &amp; Creative Agency &bull; Pune, India
              </div>
            </div>
          </motion.div>

          {/* Quick Links with sliding underline */}
          <nav aria-label="Footer navigation" className="flex items-center gap-6 sm:gap-8 flex-wrap">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[14px] font-medium text-[#5E5E63] hover:text-[#0058CC] transition-colors py-1 no-underline"
              >
                <span>{link.label}</span>
                <span
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#0058CC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          {/* Socials & Back to Top Keys */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {SOCIAL_LINKS.map((s) => (
              <Key
                key={s.name}
                href={s.href}
                variant="light"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {s.name}
              </Key>
            ))}

            <Key
              size="icon"
              variant="light"
              circle
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <ArrowUp size={16} strokeWidth={2.4} />
            </Key>
          </div>
        </div>

        {/* Giant Outlined Wordmark That Fills with Liquid Gradient on Scroll */}
        <div className="py-8 sm:py-12 select-none overflow-hidden border-b border-[rgba(0,0,0,0.06)]" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASINGS.easeOutExpo }}
          >
            <svg
              viewBox="0 0 1100 120"
              className="w-full h-auto max-w-5xl mx-auto block pointer-events-none"
            >
              <defs>
                <linearGradient id="footerWordmarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0058CC" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#1A73E8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="55%"
                dominantBaseline="central"
                textAnchor="middle"
                fontSize="84"
                fontWeight="900"
                letterSpacing="4"
                fill="url(#footerWordmarkGrad)"
                stroke="rgba(0, 88, 204, 0.45)"
                strokeWidth="1.5"
                fontFamily="var(--font-inter), sans-serif"
              >
                CUBESQUARE STUDIO
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Bottom Colophon with SoundToggle Control */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#5E5E63]">
          <p>
            &copy; {currentYear} Cubesquare Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <SoundToggle />
            <p className="flex items-center gap-2">
              <span>Precision engineered with modern liquid glass</span>
              <span aria-hidden="true">&bull;</span>
              <span>Pune, Maharashtra</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
