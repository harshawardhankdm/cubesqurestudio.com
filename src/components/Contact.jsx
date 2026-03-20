'use client'

export default function Contact() {
  return (
    <section className="bg-[#0a0a0a] py-40 px-6 md:px-16" id="contact">

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-24">
        <p className="font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.18em] uppercase text-[#0891e2]">
          Get In Touch
        </p>
        <h2
          className="font-[family-name:var(--font-head)] font-extrabold tracking-tight leading-none text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          LET'S BUILD <span className="text-[#0891e2]">TOGETHER</span>
        </h2>
        <p className="text-[0.95rem] text-white/40 leading-relaxed text-center max-w-md">
          Ready to transform your digital presence? We'd love to hear about your project.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* LEFT — Form */}
        <div className="bg-[#111111] rounded-2xl p-8 md:p-10 border border-white/5 w-full">
          <div className="mb-8">
            <h3 className="font-[family-name:var(--font-head)] text-[1.4rem] font-black text-white mb-2">
              Start a Project
            </h3>
            <p className="text-[0.83rem] text-white/40 leading-relaxed">
              Fill in the form and we'll get back to you within 24 hours.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const btn = e.target.querySelector('button[type="submit"]')
              btn.textContent = '✓ Sent!'
              btn.style.background = '#16a34a'
              setTimeout(() => {
                btn.textContent = 'Send Message →'
                btn.style.background = ''
                e.target.reset()
              }, 3000)
            }}
            className="flex flex-col gap-5 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label className="font-[family-name:var(--font-mono)] text-[0.62rem] tracking-widest uppercase text-white/30">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '0.88rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="font-[family-name:var(--font-mono)] text-[0.62rem] tracking-widest uppercase text-white/30">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '0.88rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="font-[family-name:var(--font-mono)] text-[0.62rem] tracking-widest uppercase text-white/30">Service Needed</label>
              <select
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '0.88rem', color: 'white', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option>Web & App Development</option>
                <option>Social Media Marketing</option>
                <option>Branding & Identity</option>
                <option>Photography & Videography</option>
                <option>SEO & Content</option>
                <option>Advertising & Campaigns</option>
                <option>Full Digital Package</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="font-[family-name:var(--font-mono)] text-[0.62rem] tracking-widest uppercase text-white/30">Message</label>
              <textarea
                placeholder="Tell us about your project..."
                rows={5}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '0.88rem', color: 'white', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0891e2] hover:bg-[#0670b8] text-white font-[family-name:var(--font-head)] font-bold text-[0.9rem] tracking-wide py-4 rounded-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(8,145,226,0.3)] hover:-translate-y-0.5 mt-1"
            >
              Send Message →
            </button>
          </form>
        </div>

        {/* RIGHT — stacked cards */}
        <div className="flex flex-col gap-5 w-full">

          {/* Drop us a line */}
          <div className="bg-[#111111] rounded-2xl p-8 md:p-10 border border-white/5 w-full">
            <div className="mb-7">
              <h3 className="font-[family-name:var(--font-head)] text-[1.4rem] font-black text-white mb-2">
                Drop Us a Line
              </h3>
              <p className="text-[0.83rem] text-white/40 leading-relaxed">
                Reach out directly — we usually respond within a few hours.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { icon: '@',  label: 'Email',    value: 'contact@cubesquarestudio.com', href: 'mailto:contact@cubesquarestudio.com' },
                { icon: '☎', label: 'Phone',    value: '+91 79724 24480',               href: 'tel:+917972424480' },
                { icon: '↗', label: 'Website',  value: 'www.cubesquarestudio.com',      href: 'https://www.cubesquarestudio.com' },
                { icon: '📍', label: 'Location', value: 'Pune, Maharashtra',             href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 no-underline group px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#0891e2] text-sm flex-shrink-0 group-hover:bg-[#0891e2] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-mono)] text-[0.58rem] tracking-widest text-white/25 uppercase mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-[0.85rem] text-white/60 group-hover:text-white transition-colors duration-200 truncate">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Follow us */}
          <div className="bg-[#111111] rounded-2xl p-8 border border-white/5 w-full">
            <div className="mb-5">
              <h3 className="font-[family-name:var(--font-head)] text-[1.1rem] font-black text-white mb-1">
                Follow Our Work
              </h3>
              <p className="text-[0.82rem] text-white/40">
                Stay updated with our latest projects and behind the scenes.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/cubesquarestudio', hover: 'hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30' },
                { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/cubesquare-studio-6a1180248/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bw79vUPvUTji3x0RSIvrwsQ%3D%3D', hover: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30' },
                { name: 'Facebook',  href: 'https://www.facebook.com/cubesquarestudio', hover: 'hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30' },
                { name: 'YouTube',   href: 'https://www.youtube.com/@cubesquarestudio', hover: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-[family-name:var(--font-mono)] text-[0.75rem] text-white/40 no-underline px-4 py-2.5 rounded-xl border border-white/10 transition-all duration-200 ${s.hover}`}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}