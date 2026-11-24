import { ArrowUpRight } from 'lucide-react'
import { InstagramIcon, WhatsappIcon } from '@/components/brand-icons'
import { STORE, instagramUrl, whatsappUrl } from '@/lib/store-config'

export function Contact() {
  return (
    <section id="contato" className="scroll-mt-20 mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
      <div className="mb-8 max-w-2xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Atendimento direto</p>
        <h2 className="font-display text-4xl leading-[0.98] text-balance min-[380px]:text-5xl md:text-7xl">
          A gente te ajuda a <span className="text-primary">escolher.</span>
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={whatsappUrl('Olá! Vim pelo site da MS PHONE.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Conversar com a MS PHONE pelo WhatsApp: ${STORE.whatsappDisplay}`}
          className="group flex min-h-64 flex-col justify-between gap-12 rounded-2xl border border-emerald-400/20 bg-card p-6 text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-950/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 md:p-9"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-[#25D366]">
              <WhatsappIcon className="size-6" />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-emerald-400/50 group-hover:text-[#25D366]">
              <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">WhatsApp · atendimento direto</span>
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl">{STORE.whatsappDisplay}</span>
          </div>
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Acessar Instagram da MS PHONE, @${STORE.instagramHandle}`}
          className="group flex min-h-64 flex-col justify-between gap-12 rounded-2xl border border-fuchsia-400/20 bg-card p-6 text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:bg-fuchsia-950/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fuchsia-400 md:p-9"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-950/20">
              <InstagramIcon className="size-6" />
            </span>
            <span className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-fuchsia-400/50 group-hover:text-fuchsia-300">
              <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Instagram · novidades da loja</span>
            <span className="font-display break-all text-2xl leading-tight sm:text-3xl">@{STORE.instagramHandle}</span>
          </div>
        </a>
      </div>
    </section>
  )
}
