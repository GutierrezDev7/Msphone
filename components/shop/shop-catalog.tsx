import {
  ArrowUpRight,
  Cable,
  Laptop,
  RefreshCw,
  Smartphone,
  Watch,
  Wrench,
} from 'lucide-react'
import { WhatsappIcon } from '@/components/brand-icons'
import { whatsappUrl } from '@/lib/store-config'

const CATEGORIES = [
  {
    title: 'iPhone',
    detail: 'Aparelhos novos e seminovos.',
    message: 'Olá! Quero consultar os iPhones novos e seminovos disponíveis.',
    icon: Smartphone,
  },
  {
    title: 'Xiaomi & POCO',
    detail: 'Celulares e novidades das linhas Xiaomi e POCO.',
    message: 'Olá! Quero consultar os celulares Xiaomi e POCO disponíveis.',
    icon: Smartphone,
  },
  {
    title: 'Apple Watch',
    detail: 'Relógios e acessórios para o seu dia a dia.',
    message: 'Olá! Quero consultar Apple Watch e acessórios disponíveis.',
    icon: Watch,
  },
  {
    title: 'MacBook',
    detail: 'Consulte os modelos disponíveis.',
    message: 'Olá! Quero consultar os MacBooks disponíveis.',
    icon: Laptop,
  },
  {
    title: 'Eletrônicos & acessórios',
    detail: 'Encontre acessórios para seus dispositivos.',
    message: 'Olá! Quero conhecer os eletrônicos e acessórios disponíveis.',
    icon: Cable,
  },
  {
    title: 'Assistência técnica',
    detail: 'Atendimento técnico especializado.',
    message: 'Olá! Preciso de informações sobre assistência técnica.',
    icon: Wrench,
  },
  {
    title: 'Troque seu usado',
    detail: 'Consulte a avaliação do seu aparelho na troca.',
    message: 'Olá! Quero avaliar meu aparelho para uma troca.',
    icon: RefreshCw,
  },
]

export function ShopCatalog() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map(({ title, detail, message, icon: Icon }, index) => (
        <li key={title}>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-64 flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-muted/70 md:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <span className="font-display text-sm tracking-widest text-muted-foreground/60">
                0{index + 1}
              </span>
            </div>
            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
              <ArrowUpRight className="mb-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </a>
        </li>
      ))}
      <li>
        <a
          href={whatsappUrl('Olá! Gostaria de consultar o estoque, valores e condições atualizadas.')}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-64 flex-col justify-between rounded-2xl border border-emerald-400/20 bg-card p-6 transition-all hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-950/20 md:p-8"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/10 text-[#25D366]">
              <WhatsappIcon className="size-6" />
            </span>
            <ArrowUpRight className="size-5 text-emerald-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <div>
            <h2 className="font-display text-2xl">Fale com a equipe</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Consulte estoque, valores e condições atualizadas antes de decidir.
            </p>
          </div>
        </a>
      </li>
    </ul>
  )
}
