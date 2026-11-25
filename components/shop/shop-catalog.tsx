import {
  ArrowUpRight,
  Cable,
  Headphones,
  Laptop,
  RefreshCw,
  Smartphone,
  Watch,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { WhatsappIcon } from '@/components/brand-icons'
import { whatsappUrl } from '@/lib/store-config'
import {
  canOpenConfigurator,
  type StoreCategory,
  type StoreIcon,
} from '@/lib/store-catalog'

const CATEGORY_ICONS: Record<StoreIcon, LucideIcon> = {
  smartphone: Smartphone,
  watch: Watch,
  laptop: Laptop,
  cable: Cable,
  wrench: Wrench,
  refresh: RefreshCw,
  headphones: Headphones,
}

const CARD_CLASS_NAME =
  'group flex min-h-64 flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:p-8'

export function ShopCatalog({ categories }: { categories: StoreCategory[] }) {
  const activeCategories = categories.filter((category) => category.active)

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activeCategories.map((category, index) => {
        const Icon = CATEGORY_ICONS[category.icon]
        const opensConfigurator = canOpenConfigurator(category)
        const productHref =
          category.id === 'iphone'
            ? '/loja/iphone'
            : `/loja/categoria/${encodeURIComponent(category.id)}`
        const card = (
          <>
            <div className="flex items-start justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="font-display text-sm tracking-widest text-muted-foreground/60">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{category.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.detail}
                </p>
                <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {opensConfigurator
                    ? category.id === 'assistencia-tecnica'
                      ? 'Solicitar assistência'
                      : 'Ver opções'
                    : 'Consultar no WhatsApp'}
                </span>
              </div>
              <ArrowUpRight
                className="mb-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </>
        )

        return (
          <li key={category.id}>
            {opensConfigurator ? (
              <Link href={productHref} className={CARD_CLASS_NAME}>
                {card}
              </Link>
            ) : (
              <a
                href={whatsappUrl(category.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={CARD_CLASS_NAME}
              >
                {card}
              </a>
            )}
          </li>
        )
      })}
      <li>
        <a
          href={whatsappUrl('Olá! Gostaria de consultar o estoque, valores e condições atualizadas.')}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-64 flex-col justify-between rounded-2xl border border-emerald-400/20 bg-card p-6 transition-all hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-emerald-950/20 md:p-8"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-400/10 text-[#25D366]">
              <WhatsappIcon className="size-6" aria-hidden="true" />
            </span>
            <ArrowUpRight
              className="size-5 text-emerald-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              aria-hidden="true"
            />
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
