import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
import Work from '@/components/Work'
import Process from '@/components/Process'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Marquee />
      <div className="h-24 bg-[#f8f8f6]" />
      <Services />
      <div className="h-24 bg-[#f8f8f6]" />
      <Work />
      <div className="h-24 bg-[#f8f8f6]" />
      <Process />
      <div className="h-24 bg-[#0a0a0a]" />
      <Contact />
    </main>
  )
}