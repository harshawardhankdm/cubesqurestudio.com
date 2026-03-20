'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/images/cubesquarestudioicon.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[250] flex-col items-center justify-center gap-10 bg-[#0a0a0a] transition-opacity duration-300 ${isOpen ? 'flex opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}>
        {['services','work','process','contact'].map(item => (
          <Link
            key={item}
            href={`#${item}`}
            onClick={() => setIsOpen(false)}
            className="font-[family-name:var(--font-head)] text-[3rem] font-extrabold text-white/80 hover:text-[#0891e2] no-underline uppercase tracking-tight transition-colors"
          >
            {item}
          </Link>
        ))}
        <Link
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="mt-4 font-[family-name:var(--font-head)] text-[1.1rem] font-bold bg-[#0891e2] text-white px-10 py-4 rounded-full no-underline hover:bg-[#0670b8] transition-colors"
        >
          Let's Talk →
        </Link>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-12 py-6 bg-[#0a0a0a]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
         <Image
          src={logo}
          alt="Cubesquare Studio"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="font-[family-name:var(--font-head)] text-[1.3rem] font-bold text-white tracking-tight whitespace-nowrap">
        Cube<em className="text-[#0891e2] not-italic">square</em> Studio
        </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-2 list-none">
          {['services','work','process','contact'].map(item => (
            <li key={item}>
              <Link
                href={`#${item}`}
                className="text-[0.85rem] font-medium uppercase tracking-widest text-white/50 hover:text-white no-underline px-5 py-2.5 rounded-full hover:bg-white/5 transition-all"
              >
                {item}
              </Link>
            </li>
          ))}

          {/* CTA Button */}
          <li className="ml-4">
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-2 no-underline overflow-hidden rounded-full px-6 py-3 bg-[#0891e2] transition-all duration-300 hover:bg-[#0670b8] hover:gap-3"
            >
              <span className="font-[family-name:var(--font-head)] text-[0.88rem] font-bold uppercase tracking-wider text-white">
                Let's Talk
              </span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-[0.85rem] transition-all duration-300 group-hover:bg-white/30">
                →
              </span>
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-transparent border-none cursor-pointer z-[300]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span className={`block w-[24px] h-[2px] bg-white rounded transition-transform duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
          <span className={`block w-[24px] h-[2px] bg-white rounded transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : ''}`}></span>
          <span className={`block w-[24px] h-[2px] bg-white rounded transition-transform duration-300 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
        </button>
      </nav>
    </>
  )
}