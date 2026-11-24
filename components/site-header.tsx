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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="MS PHONE, página inicial">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/70 bg-background font-display text-xs italic text-primary shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_30%,transparent)] sm:size-10 sm:text-sm">
            MS
          </span>
          <span className="hidden font-display text-lg tracking-[0.12em] min-[360px]:inline sm:text-xl md:text-2xl">PHONE</span>
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/loja"
            className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 sm:block md:hidden"
          >
            Vitrine
          </Link>
          <a
            href={whatsappUrl('Olá! Vim pelo site da MS PHONE.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com a MS PHONE pelo WhatsApp"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#062b17] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5"
          >
            <WhatsappIcon className="size-4" />
            <span className="hidden text-xs font-bold uppercase tracking-wider sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}
