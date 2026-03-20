import { Syne, Outfit, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-head', weight: ['400','500','600','700','800'] })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-body', weight: ['300','400','500','600'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','500'] })

export const metadata = {
  title: 'Cubesquare Studio — Creative Digital Agency',
  description: 'A boutique creative digital agency based in Pune.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${outfit.variable} ${dmMono.variable}`}>
        {children}
      </body>
    </html>
  )
}