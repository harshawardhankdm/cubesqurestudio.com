import { Inter } from 'next/font/google'
import LenisProvider from '@/components/LenisProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Cubesquare Studio | Creative Digital Agency in Pune',
  description: 'Cubesquare Studio is a boutique creative digital agency in Pune, India. We deliver personalized strategy, bold design, web development, and measurable growth for brands.',
  keywords: 'digital agency pune, web design pune, branding agency, social media marketing, cubesquare studio',
  authors: [{ name: 'Cubesquare Studio' }],
  openGraph: {
    title: 'Cubesquare Studio | Creative Digital Agency in Pune',
    description: 'A boutique of digital art, not a factory. Personalized strategy, bold creativity, and measurable growth.',
    url: 'https://www.cubesquarestudio.com',
    siteName: 'Cubesquare Studio',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cubesquare Studio | Creative Digital Agency in Pune',
    description: 'A boutique of digital art, not a factory. Personalized strategy, bold creativity, and measurable growth.',
  },
  metadataBase: new URL('https://www.cubesquarestudio.com'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/images/cubesquarestudioicon.png" type="image/png" />
      </head>
      <body>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
