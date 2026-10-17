'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Magnetic, EASINGS } from '@/lib/motion'
import CopyKeycap from '@/components/CopyKeycap'
import Key from '@/components/ui/Key'
import { playTick } from '@/lib/sound'

const CONTACT_INFO = [
  { icon: Mail,   label: 'Email',    value: 'contact@cubesquarestudio.com', href: 'mailto:contact@cubesquarestudio.com', copyable: 'contact@cubesquarestudio.com' },
  { icon: Phone,  label: 'Phone',    value: '+91 79724 24480',               href: 'tel:+917972424480',             copyable: '+917972424480' },
  { icon: Globe,  label: 'Website',  value: 'www.cubesquarestudio.com',      href: 'https://www.cubesquarestudio.com', copyable: 'https://www.cubesquarestudio.com' },
  { icon: MapPin, label: 'Location', value: 'Pune, Maharashtra',             href: null, copyable: null },
]

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/cubesquarestudio',
    hover: 'hover:border-pink-500/40 hover:text-pink-600',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/cubesquare-studio-6a1180248/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bw79vUPvUTji3x0RSIvrwsQ%3D%3D',
    hover: 'hover:border-blue-500/40 hover:text-blue-600',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/cubesquarestudio',
    hover: 'hover:border-indigo-500/40 hover:text-indigo-600',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@cubesquarestudio',
    hover: 'hover:border-red-500/40 hover:text-red-600',
  },
]

const SERVICE_OPTIONS = [
  'Web & App Development',
  'Social Media Marketing',
  'Branding & Identity',
  'Photography & Videography',
  'SEO & Content',
  'Advertising & Campaigns',
  'Full Digital Package',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'Web & App Development',
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  // Field validation tracking
  const isNameValid = form.name.trim().length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const isMessageValid = form.message.trim().length > 0
  const validCount = (isNameValid ? 1 : 0) + (isEmailValid ? 1 : 0) + (isMessageValid ? 1 : 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    playTick()

    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      setErrorMsg('Please complete all required fields.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setForm({ name: '', email: '', service: 'Web & App Development', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Unable to submit inquiry. Please reach out via email directly.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please email contact@cubesquarestudio.com directly.')
    }
  }

  return (
    <section id="contact" className="section-pad relative z-10 bg-[var(--color-bg)]">
      <Container>
        {/* Header Block: Left aligned to Container */}
        <div className="section-header max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASINGS.easeOutExpo }}
            className="section-header-eyebrow"
          >
            <span className="text-eyebrow">Let&apos;s Talk</span>
          </motion.div>

          <h2 className="text-h2 section-header-title">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASINGS.easeOutExpo }}
              className="inline-block"
            >
              Start a{' '}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASINGS.easeOutExpo }}
              className="inline-block text-[#0058CC]"
            >
              Project
            </motion.span>
          </h2>

          <p className="text-lead max-w-[60ch]">
            Have an idea or need to level up your digital presence? Send us a message — we will review and respond within 24 hours.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Form Column (Left, 7 cols) */}
          <div className="lg:col-span-7">
            <div
              data-card
              className="glass-strong rounded-[28px] p-6 sm:p-10 border border-[rgba(0,0,0,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              style={{ boxSizing: 'border-box' }}
            >
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center flex flex-col items-center relative overflow-hidden"
                >
                  {/* Flight path and paper plane animation */}
                  <div className="w-full h-24 relative mb-4">
                    <svg viewBox="0 0 240 80" className="w-full h-full">
                      <motion.path
                        d="M 20,60 Q 100,10 200,30"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                      <motion.circle
                        cx="200"
                        cy="30"
                        r="5"
                        fill="#10B981"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.4, 1] }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                      />
                    </svg>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 size={36} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2">
                    Message Dispatched
                  </h3>
                  <p className="text-[15px] text-[#5E5E63] max-w-sm mb-6 leading-relaxed">
                    Thank you for reaching out. A senior partner will review your inquiry and respond within 24 hours.
                  </p>
                  <Key
                    type="button"
                    variant="light"
                    size="md"
                    onClick={() => {
                      playTick()
                      setStatus('idle')
                    }}
                  >
                    Send another message &rarr;
                  </Key>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  animate={status === 'error' ? { x: [-6, 6, -4, 4, -2, 2, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-5"
                >
                  {/* Slim Progress Meter Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/6">
                    <span className="text-[12px] font-mono font-semibold text-[#5E5E63]">
                      Required: {validCount}/3 Completed
                    </span>
                    <div className="w-32 h-[3px] bg-black/6 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#0058CC] to-[#10B981] rounded-full"
                        animate={{ width: `${(validCount / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Row: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contact-name" className="text-[14px] font-semibold text-[#3A3A3C] normal-case tracking-normal mb-2 block">
                        Your name <span className="text-[#0058CC]">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-email" className="text-[14px] font-semibold text-[#3A3A3C] normal-case tracking-normal mb-2 block">
                        Email address <span className="text-[#0058CC]">*</span>
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rahul@company.com"
                      />
                    </div>
                  </div>

                  {/* Service Needed Dropdown */}
                  <div className="relative">
                    <Label htmlFor="contact-service" className="text-[14px] font-semibold text-[#3A3A3C] normal-case tracking-normal mb-2 block">
                      Service needed <span className="text-[#0058CC]">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        id="contact-service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="form-field-base flex h-[56px] w-full rounded-[16px] px-5 py-3 text-[16px] text-[#1D1D1F] cursor-pointer appearance-none pr-12"
                        style={{
                          paddingLeft: '20px',
                          paddingRight: '48px',
                          boxSizing: 'border-box',
                        }}
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg keycap text-[#5E5E63] flex items-center justify-center">
                        <ChevronDown size={16} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="contact-message" className="text-[14px] font-semibold text-[#3A3A3C] normal-case tracking-normal mb-2 block">
                      Message <span className="text-[#0058CC]">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your brand, goals, and target timeline..."
                    />
                  </div>

                  {/* Error Notification */}
                  {status === 'error' && (
                    <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-[14px]">
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Key
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={status === 'loading'}
                      loading={status === 'loading'}
                      className="w-full"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={18} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </Key>
                  </div>
                </motion.form>
              )}
            </div>
          </div>

          {/* Right Direct Info & Social Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Direct Contact Cards */}
            <div
              data-card
              className="glass-strong p-6 sm:p-8 rounded-[28px] border border-[rgba(0,0,0,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              style={{ boxSizing: 'border-box' }}
            >
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-1.5">
                Drop Us a Line
              </h3>
              <p className="text-[14px] text-[#5E5E63] mb-6 leading-relaxed">
                Reach out directly — we usually respond within a few hours.
              </p>

              <div className="flex flex-col gap-3">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon
                  const Wrapper = item.href ? 'a' : 'div'

                  return (
                    <Wrapper
                      key={item.label}
                      href={item.href || undefined}
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white/50 hover:bg-white hover:border-[#0058CC]/30 transition-all duration-200 group no-underline shadow-sm hover:shadow-md"
                      style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    >
                      <div className="keycap w-11 h-11 rounded-xl text-[#0058CC] flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
                        <Icon size={19} strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-mono font-semibold tracking-wider text-[#5E5E63] uppercase block">
                          {item.label}
                        </span>
                        <span className="text-[15px] font-semibold text-[#1D1D1F] group-hover:text-[#0058CC] transition-colors truncate block">
                          {item.value}
                        </span>
                      </div>
                      {item.copyable && (
                        <CopyKeycap text={item.copyable} label={`Copy ${item.label}`} />
                      )}
                    </Wrapper>
                  )
                })}
              </div>
            </div>

            {/* Social Links Card */}
            <div
              data-card
              className="glass-strong p-6 sm:p-8 rounded-[28px] border border-[rgba(0,0,0,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              style={{ boxSizing: 'border-box' }}
            >
              <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
                Follow Our Work
              </h3>
              <p className="text-[14px] text-[#5E5E63] mb-5">
                Stay updated with our latest projects and behind the scenes.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((s) => (
                  <Magnetic key={s.name} strength={0.32}>
                    <Key
                      href={s.href}
                      variant="light"
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      {s.name}
                    </Key>
                  </Magnetic>
                ))}
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  )
}
