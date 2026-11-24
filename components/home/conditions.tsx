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
    <section
      aria-labelledby="conditions-title"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-5 md:px-8 md:pb-36"
    >
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Encontre o seu</p>
          <h2
            id="conditions-title"
            className="font-display text-[clamp(2rem,7vw,3rem)] leading-[0.98] text-balance md:text-6xl xl:text-7xl"
          >
            O próximo capítulo <span className="text-primary">é seu.</span>
          </h2>
        </div>
        <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Compare as condições e fale com a equipe para conferir disponibilidade e valores atualizados.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((option, index) => {
          const isTradeIn = option.id === 'troca'
          const Icon = option.icon
          return (
            <Link
              key={option.id}
              href={isTradeIn ? '/#contato' : '/loja'}
              className={`group flex min-h-56 flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:hover:translate-y-0 motion-reduce:transition-none sm:min-h-64 sm:p-6 md:p-7 lg:min-h-72 lg:p-8 ${
                isTradeIn
                  ? 'md:col-span-2 md:min-h-48 md:flex-row md:items-center md:gap-8 lg:col-span-1 lg:min-h-72 lg:flex-col lg:items-stretch lg:gap-0'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl border border-border/70 sm:size-14 ${option.iconStyle}`}
                >
                  <Icon className="size-5 sm:size-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="font-display text-xs tracking-widest text-muted-foreground/60 sm:text-sm">
                  0{index + 1}
                </span>
              </div>
              <div className={`mt-8 sm:mt-10 ${isTradeIn ? 'md:mt-0 lg:mt-10' : ''}`}>
                <h3 className="font-display text-3xl leading-tight">{option.label}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {option.detail}
                </p>
              </div>
              <div
                className={`mt-8 flex items-center justify-between border-t border-border/70 pt-5 text-sm ${
                  isTradeIn
                    ? 'md:mt-0 md:shrink-0 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:mt-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5'
                    : ''
                }`}
              >
                <span className="font-semibold text-foreground/85">{option.action}</span>
                <span className="flex size-10 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight
                    className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
