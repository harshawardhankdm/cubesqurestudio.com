'use client'
import { useEffect, useRef } from 'react'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cells = []
    for (let i = 0; i < 72; i++) {
      const c = document.createElement('div')
      c.style.cssText = 'background:#161616;border-radius:2px;transition:background 0.6s;'
      canvas.appendChild(c)
      cells.push(c)
    }
    const flash = setInterval(() => {
      const n = Math.floor(Math.random() * cells.length)
      cells[n].style.background = Math.random() > .5 ? '#0891e2' : Math.random() > .5 ? '#0670b8' : '#1f2a38'
      setTimeout(() => { cells[n].style.background = '#161616' }, 800 + Math.random() * 1200)
    }, 120)
    return () => clearInterval(flash)
  }, [])

  return (
    <section className="min-h-screen pt-[100px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* Left */}
      <div className="flex flex-col justify-center px-8 py-16 md:px-14 md:py-20 animate-[heroIn_0.9s_0.2s_ease_both]">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.72rem] tracking-[0.14em] text-[#0891e2] uppercase mb-8">
          <span className="w-5 h-[2px] bg-[#0891e2] inline-block flex-shrink-0"></span>
          Creative Digital Agency · Pune
        </div>

        {/* Heading */}
        <h1
          className="font-[family-name:var(--font-head)] font-extrabold leading-[1.0] tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 5.5rem)' }}
        >
          WE TURN<br />
          <span className="text-[#0891e2]">VISIONS</span><br />
          INTO <span style={{ WebkitTextStroke: '2px #0a0a0a', color: 'transparent' }}>RESULTS</span>
        </h1>

        {/* Description */}
        <p className="font-[family-name:var(--font-body)] text-[1rem] font-light text-[#6b7280] max-w-md mb-10 leading-[1.85]">
          A boutique of digital art — not a factory. We bring personalized strategy, bold creativity, and measurable growth to every client we work with.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Primary — See Our Work */}
          <a
            href="#work"
            className="group relative inline-flex items-center justify-center gap-2 no-underline overflow-hidden rounded-xl px-7 py-4 bg-[#0891e2] transition-all duration-300 hover:bg-[#0670b8] hover:shadow-[0_8px_30px_rgba(8,145,226,0.35)] hover:-translate-y-0.5"
          >
            <span className="font-[family-name:var(--font-head)] text-[0.88rem] font-bold tracking-wide text-white">
              See Our Work
            </span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 text-white text-[0.85rem] transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-0.5">
              →
            </span>
          </a>

          {/* Secondary — Start a Project */}
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 no-underline rounded-xl px-7 py-4 border-2 border-[#0a0a0a] text-[#0a0a0a] transition-all duration-300 hover:border-[#0891e2] hover:text-[#0891e2] hover:bg-[#0891e2]/5 hover:-translate-y-0.5"
          >
            <span className="font-[family-name:var(--font-head)] text-[0.88rem] font-bold tracking-wide">
              Start a Project
            </span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-current text-[0.85rem] transition-all duration-300 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>

        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-12 pt-8 border-t border-[#e5e5e0]">
          {[['200+', 'Projects Done'], ['50+', 'Happy Clients'], ['6+', 'Years Active']].map(([num, label]) => (
            <div key={label}>
              <div className="font-[family-name:var(--font-head)] text-[2.2rem] font-extrabold text-[#0891e2] leading-none">{num}</div>
              <div className="text-[0.78rem] text-[#6b7280] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Cube canvas */}
      <div className="relative bg-[#0a0a0a] overflow-hidden min-h-[50vw] md:min-h-0">
        <div
          ref={canvasRef}
          className="absolute inset-0 grid gap-[3px] p-[3px]"
          style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
        />
        {/* Overlay card */}
        <div className="absolute bottom-10 left-10 bg-[#0891e2] text-white px-8 py-5 rounded-xl">
          <div className="font-[family-name:var(--font-head)] text-[2.8rem] font-extrabold leading-none">360°</div>
          <div className="text-[0.78rem] opacity-85 mt-1 tracking-widest">DIGITAL SOLUTIONS</div>
        </div>
        {/* Tag */}
        <div className="absolute top-8 right-8 border border-white/10 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <span className="font-[family-name:var(--font-mono)] text-[0.72rem] text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
            Currently Accepting Clients
          </span>
        </div>
      </div>
    </section>
  )
}