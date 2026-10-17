import AmbientBackground from '@/components/AmbientBackground'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
import Work from '@/components/Work'
import Process from '@/components/Process'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import BackToTop from '@/components/motion/BackToTop'
import SectionConnector from '@/components/SectionConnector'
import { GiantMarqueeBand } from '@/components/motion/text'
import HiddenDelights from '@/components/HiddenDelights'
import MotionDebugPanel from '@/components/MotionDebugPanel'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] selection:bg-[#0058CC] selection:text-white overflow-x-clip">
      {/* First-visit Cinematic Preloader */}
      <Preloader />

      {/* High-Performance Custom Cursor */}
      <Cursor />

      {/* Hidden Delights (Tab title change, logo easter egg) */}
      <HiddenDelights />

      {/* Vertical SVG Section Connector Spine */}
      <SectionConnector />

      {/* Living Ambient Background with Parallax Orbs and Desktop Cursor Glow */}
      <AmbientBackground />

      {/* Main Content Sections (Strictly following master section order) */}
      <Nav />
      <Hero />
      <Marquee />
      <Services />

      {/* Oversized Outline Stroke Marquee Band */}
      <GiantMarqueeBand />

      <Work />
      <Process />
      <Contact />
      <Footer />

      {/* Floating Circular Progress Back to Top Button */}
      <BackToTop />

      {/* Dev-only Motion Debug Panel (?motion=debug) */}
      <MotionDebugPanel />
    </div>
  )
}
