'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WhatsappIcon } from '@/components/brand-icons'
import { cn } from '@/lib/utils'
import { whatsappUrl } from '@/lib/store-config'

const NAV = [
  { href: '/#servicos', label: 'Serviços' },
  { href: '/loja', label: 'Comprar' },
  { href: '/#contato', label: 'Contato' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled ? 'border-b border-border bg-background/90 backdrop-blur-xl' : 'bg-background/0',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="MS PHONE, página inicial">
          <span className="flex size-10 items-center justify-center rounded-full border border-primary/70 bg-background font-display text-sm italic text-primary shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_30%,transparent)]">
            MS
          </span>
          <span className="font-display text-xl tracking-[0.12em] md:text-2xl">PHONE</span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:text-primary aria-[current=page]:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/loja"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 md:hidden"
          >
            Vitrine
          </Link>
          <a
            href={whatsappUrl('Olá! Vim pelo site da MS PHONE.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#062b17] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
          >
            <WhatsappIcon className="size-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}
