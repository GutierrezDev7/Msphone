import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { CategoryOrderPage } from '@/components/shop/category-order-page'
import { canOpenConfigurator } from '@/lib/store-catalog'
import { getStoreCatalog } from '@/lib/store-catalog-server'

export const metadata: Metadata = {
  title: 'Configure seu pedido — MS PHONE',
  description:
    'Escolha o produto e as opções desejadas e consulte valores e disponibilidade com a equipe MS PHONE.',
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await connection()
  const { slug } = await params
  const catalog = await getStoreCatalog()
  const category = catalog.categories.find((entry) => entry.id === slug && entry.active)

  if (!category || !canOpenConfigurator(category)) notFound()

  return <CategoryOrderPage category={category} />
}
