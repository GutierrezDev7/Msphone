import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { CategoryOrderPage } from '@/components/shop/category-order-page'
import { getStoreCatalog } from '@/lib/store-catalog-server'

export const metadata: Metadata = {
  title: 'Configure seu iPhone — MS PHONE',
  description:
    'Escolha o modelo e o armazenamento do iPhone que procura e consulte a disponibilidade, valores e opção de troca com a equipe MS PHONE.',
}

export default async function IPhonePage() {
  await connection()
  const catalog = await getStoreCatalog()
  const category = catalog.categories.find((entry) => entry.id === 'iphone' && entry.active)

  if (!category || !category.products.some((product) => product.active)) notFound()

  return <CategoryOrderPage category={category} />
}
