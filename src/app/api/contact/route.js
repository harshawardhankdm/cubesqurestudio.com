import { NextResponse } from 'next/server'

// TODO: connect email provider (Resend)
// Install: npm install resend
// Add to .env.local: RESEND_API_KEY=your_key_here
// Then replace the console.log below with:
// const resend = new Resend(process.env.RESEND_API_KEY)
// await resend.emails.send({
//   from: 'Cubesquare Studio <noreply@cubesquarestudio.com>',
//   to: ['contact@cubesquarestudio.com'],
//   subject: `New enquiry from ${name}`,
//   html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Service:</strong> ${service}</p><p><strong>Message:</strong> ${message}</p>`,
// })

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, service, message } = body

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: 'Please enter a message (at least 10 characters).' }, { status: 400 })
    }

    // Log submission (replace with email send)
    console.log('[Contact Form Submission]', {
      name: name.trim(),
      email: email.trim(),
      service: service || 'Not specified',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Message received.' })
  } catch (err) {
    console.error('[Contact API Error]', err)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
