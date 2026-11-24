import { ArrowUpRight, Headphones, RefreshCw, Smartphone, Wrench } from 'lucide-react'
import Link from 'next/link'

const SERVICES = [
  {
    title: 'iPhones novos e seminovos',
    text: 'Encontre o aparelho ideal para sua rotina e seu momento.',
    icon: Smartphone,
    href: '/loja',
  },
  {
    title: 'Assistência técnica',
    text: 'Conte com uma equipe especializada para cuidar do seu aparelho.',
    icon: Wrench,
    href: '/loja',
  },
  {
    title: 'Eletrônicos e acessórios',
    text: 'Mais opções para completar seu ecossistema conectado.',
    icon: Headphones,
    href: '/loja',
  },
  {
    title: 'Seu usado na troca',
    text: 'Traga seu aparelho e consulte a avaliação para trocar por outro.',
    icon: RefreshCw,
    href: '/loja',
  },
]

export function About() {
  return (
    <section id="servicos" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1.1fr_0.7fr] md:items-end">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">MS PHONE • Tecnologia e cuidado</p>
          <h2 className="font-display text-4xl leading-[0.98] text-balance min-[380px]:text-5xl md:text-7xl">
            Tudo para estar <span className="text-primary">sempre conectado.</span>
          </h2>
        </div>
        <p className="max-w-lg text-pretty leading-relaxed text-muted-foreground md:justify-self-end">
          Da escolha do aparelho ao cuidado com o que você já tem: tecnologia, suporte e praticidade
          em um só lugar.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ title, text, icon: Icon, href }, index) => (
          <li key={title}>
            <Link
              href={href}
              className="group flex h-full min-h-64 flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-muted/70 md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="font-display text-sm tracking-widest text-muted-foreground/60">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-10 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl leading-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
                <ArrowUpRight className="mb-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
