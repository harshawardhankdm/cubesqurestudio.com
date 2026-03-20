export default function Marquee() {
  const items = ['Web Development','Social Media','Branding','SEO','Photography','Advertising','App Development','Packaging','Content Marketing']
  const doubled = [...items, ...items]

  return (
    <div className="bg-[#0891e2] py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-[family-name:var(--font-head)] text-[0.95rem] font-semibold tracking-widest text-white px-8 inline-flex items-center gap-6 after:content-['◆'] after:text-[0.5rem] after:opacity-60"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}