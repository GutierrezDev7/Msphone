import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-inter-tight' })

export const metadata: Metadata = {
  title: 'MS PHONE — iPhones, assistência e acessórios',
  description:
    'iPhones novos e seminovos, assistência técnica especializada, eletrônicos e acessórios. Fale com a MS PHONE pelo WhatsApp.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#080d18',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${interTight.variable} bg-background scroll-pt-20 md:scroll-pt-24`}
    >
      <body className="antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
