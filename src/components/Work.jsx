import Image from 'next/image'
import prettyBee from '@/images/pretty-bee.png'
import embox from '@/images/embox.png'
import nikams from '@/images/nikams-organics.png'
import carnival from '@/images/carnival-resorts.png'
import monsoon from '@/images/monsoon-dance.png'
import sarrthi from '@/images/sarrthi-reality.png'

const works = [
  { name: 'Pretty Bee',        type: 'E-Commerce Website',        label: 'E-COMMERCE', image: prettyBee },
  { name: 'EMbox',             type: 'Social Media + Branding',   label: 'SOCIAL',     image: embox },
  { name: "Nikam's Organics",  type: 'Brand Identity + Packaging',label: 'BRANDING',   image: nikams },
  { name: 'Carnival Resort',   type: 'Website + Social Media',    label: 'WEBSITE',    image: carnival },
  { name: 'Monsoon Dance Co.', type: 'Social Media Marketing',    label: 'SOCIAL',     image: monsoon },
  { name: 'Saarrthi Realty',   type: 'Digital Marketing + Web',   label: 'DIGITAL',    image: sarrthi },
]

export default function Work() {
  return (
    <section className="py-32 px-6 md:px-16 bg-[#f8f8f6]" id="work">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.18em] uppercase text-[#0891e2] mb-3">
            Selected Work
          </p>
          <h2
            className="font-[family-name:var(--font-head)] font-extrabold tracking-tight leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            WHAT WE'VE <span className="text-[#0891e2]">BUILT</span>
          </h2>
        </div>
        <p className="text-[0.9rem] text-[#6b7280] max-w-xs leading-relaxed md:text-right">
          A selection of brands we've helped grow through design, strategy & digital execution.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((w, i) => (
          <div
            key={w.name}
            className="group relative overflow-hidden rounded-2xl border border-[#e5e5e0] cursor-pointer bg-white"
            style={{ animation: 'fadeUp 0.5s ease both', animationDelay: `${i * 0.08}s` }}
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src={w.image}
                alt={w.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Label */}
              <div className="absolute top-4 left-4 bg-[#0891e2] text-white font-[family-name:var(--font-mono)] text-[0.62rem] tracking-widest px-3 py-1.5 rounded-full z-10">
                {w.label}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#e5e5e0]">
              <div>
                <h4 className="font-[family-name:var(--font-head)] text-[0.95rem] font-bold text-[#0a0a0a] leading-tight">
                  {w.name}
                </h4>
                <span className="font-[family-name:var(--font-mono)] text-[#6b7280] text-[0.72rem] mt-0.5 block">
                  {w.type}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#f8f8f6] border border-[#e5e5e0] flex items-center justify-center text-[#0891e2] text-[0.85rem] group-hover:bg-[#0891e2] group-hover:text-white group-hover:border-[#0891e2] transition-all duration-300 flex-shrink-0">
                →
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}