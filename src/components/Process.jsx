const steps = [
  {
    num: '01',
    title: 'Discovery',
    point: 'Understand your brand, audience & goals before we touch anything.',
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><circle cx="20" cy="20" r="12" /><path d="M30 30l8 8" /></svg>
  },
  {
    num: '02',
    title: 'Strategy',
    point: 'Custom roadmap built around your budget — approved by you upfront.',
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M8 34l10-14 8 8 6-8 10 14" /><rect x="4" y="4" width="36" height="36" rx="3" /></svg>
  },
  {
    num: '03',
    title: 'Creation',
    point: 'Design & development crafted with obsessive attention to detail.',
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M10 34L6 38l4-14 24-24 10 10L20 34H10z" /><path d="M30 10l4 4" /></svg>
  },
  {
    num: '04',
    title: 'Launch',
    point: 'On-time delivery with full handover, training & support included.',
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M22 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" /><path d="M22 32v8M16 36h12" /></svg>
  },
  {
    num: '05',
    title: 'Grow',
    point: 'Ongoing optimization & scaling — we are your long-term partner.',
    icon: <svg viewBox="0 0 44 44" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M6 34l10-12 8 6 12-18" /><path d="M30 10h8v8" /></svg>
  },
]

export default function Process() {
  return (
    <section className="bg-[#0a0a0a] py-32 px-6 md:px-16" id="process">

      {/* Header */}
      <div className="flex flex-col items-start mb-16">
        <p className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.18em] uppercase text-[#0891e2] mb-3">
          How We Work
        </p>
        <h2
          className="font-[family-name:var(--font-head)] font-extrabold tracking-tight leading-none text-white mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          OUR <span className="text-[#0891e2]">PROCESS</span>
        </h2>
        <p className="text-[0.9rem] text-white/40 leading-relaxed">
          A proven 5-step approach that takes your brand from idea to execution — with zero guesswork.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="group relative bg-[#111111] rounded-2xl p-10 flex flex-col gap-6 border border-white/5 hover:border-[#0891e2] hover:shadow-[0_8px_40px_rgba(8,145,226,0.12)] transition-all duration-300 cursor-pointer overflow-hidden"
            style={{
              animation: `fadeUp 0.5s ease both, cardGlow 3s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s, ${i * 0.6}s`,
            }}
          >
            {/* Blue accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0891e2] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-t-2xl" />

            {/* Top row — number + icon */}
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-mono)] text-[0.65rem] tracking-widest text-white/20">
                {s.num}
              </span>
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center p-3 group-hover:bg-[#0891e2] transition-colors duration-300 [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[#0891e2] group-hover:[&>svg]:stroke-white">
                {s.icon}
              </div>
            </div>

            {/* Big number */}
            <div className="font-[family-name:var(--font-head)] font-black text-[3.5rem] leading-none text-white/10 group-hover:text-[#0891e2]/20 transition-colors duration-300 select-none">
              {s.num}
            </div>

            {/* Title */}
            <h4 className="font-[family-name:var(--font-head)] text-[1.2rem] font-black text-white leading-tight">
              {s.title}
            </h4>

            {/* Divider */}
            <div className="w-10 h-[2px] bg-white/10 group-hover:bg-[#0891e2] transition-colors duration-300" />

            {/* Point */}
            <p className="text-[0.85rem] text-white/40 group-hover:text-white/70 leading-relaxed transition-colors duration-300">
              {s.point}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}