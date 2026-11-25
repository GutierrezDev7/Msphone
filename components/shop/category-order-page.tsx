import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CategoryConfigurator } from '@/components/shop/category-configurator'
import type { StoreCategory } from '@/lib/store-catalog'

export function CategoryOrderPage({ category }: { category: StoreCategory }) {
  const isIPhone = category.id === 'iphone'
  const isAssistance = category.id === 'assistencia-tecnica'

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-24 md:pt-40">
      <Link
        href="/loja"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar à loja
      </Link>

      <header className="mb-10 max-w-4xl sm:mb-14">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Vitrine MS PHONE · {category.title}
        </p>
        <h1 className="font-display text-4xl leading-[0.95] text-balance min-[380px]:text-5xl sm:text-6xl md:text-8xl">
          {isAssistance ? (
            <>
              Conte com nossa <span className="text-primary">assistência técnica.</span>
            </>
          ) : isIPhone ? (
            <>
              Seu próximo iPhone, <span className="text-primary">do seu jeito.</span>
            </>
          ) : (
            <>
              Encontre sua próxima <span className="text-primary">escolha.</span>
            </>
          )}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {category.detail}{' '}
            {isAssistance
              ? 'Nossa equipe vai orientar você pelo WhatsApp.'
              : 'Consulte disponibilidade e valores atualizados com a equipe.'}
        </p>
      </header>

      <CategoryConfigurator category={category} />
    </main>
  )
}
