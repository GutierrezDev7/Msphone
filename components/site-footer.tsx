import Link from 'next/link'
import { InstagramIcon, WhatsappIcon } from '@/components/brand-icons'
import { STORE, instagramUrl, whatsappUrl } from '@/lib/store-config'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="flex flex-col gap-3">
          <p className="font-display text-6xl tracking-[0.1em] md:text-8xl">
            <span className="text-primary">MS</span> PHONE
          </p>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            iPhones, assistência técnica, eletrônicos e acessórios para acompanhar o seu ritmo.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-card p-3 text-fuchsia-300 transition-colors hover:border-fuchsia-400/50 hover:bg-fuchsia-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-400"
              aria-label={`Instagram @${STORE.instagramHandle}`}
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-card p-3 text-[#25D366] transition-colors hover:border-emerald-400/50 hover:bg-emerald-950/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
              aria-label="WhatsApp da MS PHONE"
            >
              <WhatsappIcon className="size-5" />
            </a>
          </div>
          <nav aria-label="Rodapé" className="flex gap-6 text-sm uppercase tracking-widest text-muted-foreground">
            <Link href="/#servicos" className="hover:text-foreground">Serviços</Link>
            <Link href="/loja" className="hover:text-foreground">Comprar</Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            {`© ${new Date().getFullYear()} ${STORE.name}. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
