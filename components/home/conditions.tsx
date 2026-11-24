import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, RefreshCw, Smartphone } from 'lucide-react'

const OPTIONS = [
  {
    id: 'novo',
    label: 'Novo',
    detail: 'Conheça os modelos novos e consulte a disponibilidade.',
    action: 'Ver aparelhos',
    icon: Smartphone,
    iconStyle: 'bg-sky-400/10 text-sky-300',
  },
  {
    id: 'seminovo',
    label: 'Seminovo',
    detail: 'Consulte aparelhos revisados e as condições disponíveis.',
    action: 'Ver seminovos',
    icon: BadgeCheck,
    iconStyle: 'bg-amber-400/10 text-amber-300',
  },
  {
    id: 'troca',
    label: 'Troca',
    detail: 'Converse com a equipe para avaliar seu aparelho.',
    action: 'Falar sobre troca',
    icon: RefreshCw,
    iconStyle: 'bg-emerald-400/10 text-emerald-300',
  },
]

export function Conditions() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-36">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Encontre o seu</p>
          <h2 className="font-display text-5xl leading-[0.95] text-balance md:text-7xl">
            O próximo capítulo <span className="text-primary">é seu.</span>
          </h2>
        </div>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          Compare as condições e fale com a equipe para conferir disponibilidade e valores atualizados.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {OPTIONS.map((option, index) => {
          const isTradeIn = option.id === 'troca'
          const Icon = option.icon
          return (
            <Link
              key={option.id}
              href={isTradeIn ? '/#contato' : '/loja'}
              className="group flex min-h-72 flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-14 items-center justify-center rounded-2xl border border-border/70 ${option.iconStyle}`}>
                  <Icon className="size-6" strokeWidth={1.8} />
                </span>
                <span className="font-display text-sm tracking-widest text-muted-foreground/60">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-12">
                <h3 className="font-display text-3xl">{option.label}</h3>
                <p className="mt-2 max-w-64 text-sm leading-relaxed text-muted-foreground">
                  {option.detail}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-5 text-sm">
                <span className="font-semibold text-foreground/85">{option.action}</span>
                <span className="flex size-10 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
