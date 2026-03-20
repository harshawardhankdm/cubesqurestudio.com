const services = [
  {
    num: '01',
    title: 'Web & App Development',
    points: ['Custom websites & mobile apps built to perform', 'WordPress, React, full-stack — we handle it all'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="8" width="36" height="26" rx="3"/><path d="M14 34l-3 6h22l-3-6"/><path d="M12 22l7 6 12-14"/></svg>
  },
  {
    num: '02',
    title: 'Social Media Marketing',
    points: ['Content strategy & post design that converts', 'Community management that builds loyal followers'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M8 32l10-12 8 8 12-16"/><circle cx="36" cy="12" r="3"/></svg>
  },
  {
    num: '03',
    title: 'Branding & Identity',
    points: ['Logos & visual systems that stick in memory', 'Stationery & packaging done with precision'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="26" y="6" width="12" height="12" rx="2"/><rect x="6" y="26" width="12" height="12" rx="2"/><rect x="26" y="26" width="12" height="12" rx="2"/></svg>
  },
  {
    num: '04',
    title: 'SEO & Content Marketing',
    points: ['Data-driven SEO that compounds over time', 'Organic growth you own — not rented attention'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><circle cx="22" cy="22" r="16"/><path d="M22 6c0 0-8 7-8 16s8 16 8 16"/><path d="M6 22h32"/><path d="M8 14h28M8 30h28"/></svg>
  },
  {
    num: '05',
    title: 'Photography & Videography',
    points: ['Food, fashion, product & interior shoots', 'Professional visuals that elevate your brand'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><circle cx="22" cy="16" r="8"/><path d="M6 38c0-8 7-14 16-14s16 6 16 14"/></svg>
  },
  {
    num: '06',
    title: 'Advertising & Campaigns',
    points: ['Meta & Google ads built for maximum ROI', 'From concept to conversion — end to end'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="10" width="26" height="20" rx="3"/><path d="M30 18l10-6v20l-10-6V18z"/></svg>
  },
  {
    num: '07',
    title: 'Print & Packaging Design',
    points: ['Flyers, catalogues, standees & product labels', 'Amazon listings that convert at every touchpoint'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M6 10h32M6 18h22M6 26h28M6 34h18"/></svg>
  },
  {
    num: '08',
    title: 'Legal & Financial Services',
    points: ['End-to-end business setup & compliance', 'Financial guidance to build on solid ground'],
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M22 4l4 12h14l-11 8 4 14L22 30l-11 8 4-14L4 16h14z"/></svg>
  },
]

export default function Services() {
  return (
    <section className="bg-[#f8f8f6] py-32 px-6 md:px-16" id="services">
      <p className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.18em] uppercase text-[#0891e2] mb-3">
        What We Offer
      </p>
      <h2
        className="font-[family-name:var(--font-head)] font-extrabold tracking-tight leading-none mb-16"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        OUR <span className="text-[#0891e2]">SERVICES</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s) => (
          <div
            key={s.num}
            className="group relative bg-white rounded-2xl p-10 flex flex-col gap-6 border border-[#e5e5e0] hover:border-[#0891e2] hover:shadow-[0_8px_40px_rgba(8,145,226,0.12)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Blue accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0891e2] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-t-2xl" />

            {/* Top row — number + icon */}
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-[0.65rem] tracking-widest text-[#d1d5db]">
                {s.num}
              </span>
              <div className="w-14 h-14 bg-[#e8f5fd] rounded-xl flex items-center justify-center p-3 group-hover:bg-[#0891e2] transition-colors duration-300 [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[#0891e2] group-hover:[&>svg]:stroke-white">
                {s.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-head)] text-[1.2rem] font-black text-[#0a0a0a] leading-tight">
              {s.title}
            </h3>

            {/* Divider */}
            <div className="w-10 h-[2px] bg-[#e5e5e0] group-hover:bg-[#0891e2] transition-colors duration-300" />

            {/* Points */}
            <ul className="flex flex-col gap-3">
              {s.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.85rem] text-[#6b7280] leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0891e2] flex-shrink-0 mt-[5px]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}