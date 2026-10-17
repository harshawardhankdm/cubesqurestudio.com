'use client'

const SERVICES_TICKER_1 = [
  'Web & App Development',
  'Social Media Marketing',
  'Branding & Identity',
  'SEO & Content Marketing',
  'Commercial Photography',
  'Advertising & Campaigns',
  'Print & Packaging Design',
  'Business Setup & Advisory',
]

const SERVICES_TICKER_2 = [
  'Custom Next.js & React',
  'High-Converting Funnels',
  'Brand Guidelines & Systems',
  'Search Engine Dominance',
  'Boutique Visual Direction',
  'Scalable Full-Stack Tech',
  'Tactile Packaging Design',
  'Mathematical Precision',
]

export default function Marquee() {
  const row1 = [...SERVICES_TICKER_1, ...SERVICES_TICKER_1, ...SERVICES_TICKER_1]
  const row2 = [...SERVICES_TICKER_2, ...SERVICES_TICKER_2, ...SERVICES_TICKER_2]

  return (
    <div
      className="relative w-full overflow-hidden py-5 border-y border-[rgba(0,0,0,0.06)] bg-white/45 backdrop-blur-md flex flex-col gap-3.5"
      aria-hidden="true"
    >
      {/* Edge gradient mask fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent z-10" />

      {/* Row 1: Forward Track */}
      <div className="animate-marquee-track">
        {row1.map((item, i) => (
          <div key={`r1-${i}`} className="flex items-center gap-3.5 px-3">
            <span
              className="marquee-pill-item"
              data-text={item}
              aria-label={item}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#0058CC]/45 shrink-0" />
          </div>
        ))}
      </div>

      {/* Row 2: Reverse Track */}
      <div className="animate-marquee-track-reverse">
        {row2.map((item, i) => (
          <div key={`r2-${i}`} className="flex items-center gap-3.5 px-3">
            <span
              className="marquee-pill-item"
              data-text={item}
              aria-label={item}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/45 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
