import type { Metadata } from 'next'
import { ShopCatalog } from '@/components/shop/shop-catalog'

export const metadata: Metadata = {
  title: 'Vitrine — MS PHONE',
  description: 'Conheça as categorias da MS PHONE e consulte aparelhos, acessórios e assistência pelo WhatsApp.',
}

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-24 md:pt-40">
      <header className="mb-12 flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Conheça a MS PHONE</p>
        <h1 className="font-display text-4xl leading-[0.92] text-balance min-[380px]:text-5xl sm:text-6xl md:text-8xl">
          Tecnologia. <span className="text-primary">Do seu jeito.</span>
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Consulte disponibilidade, valores e serviços diretamente com a nossa equipe. O estoque
          muda — no WhatsApp você recebe a informação atualizada.
        </p>
      </header>
      <ShopCatalog />
    </main>
  )
}
