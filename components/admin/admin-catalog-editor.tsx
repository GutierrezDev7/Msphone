'use client'

import {
  ChevronDown,
  LogOut,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  isConfiguratorCategory,
  isStoreCatalog,
  STORE_ICON_OPTIONS,
  type StoreCatalog,
  type StoreCategory,
  type StoreProduct,
  type StoreVariant,
} from '@/lib/store-catalog'

type Notice = { kind: 'success' | 'error'; message: string }

const INPUT_CLASS_NAME =
  'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function parseOptionalNumber(value: string) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100_000_000 ? parsed : null
}

function parseOptionalStock(value: string) {
  if (!value) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed >= 0 && parsed <= 10_000_000 ? parsed : null
}

function getErrorMessage(value: unknown, fallback: string) {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error
  }
  return fallback
}

export function AdminCatalogEditor() {
  const router = useRouter()
  const [catalog, setCatalog] = useState<StoreCatalog | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      try {
        const response = await fetch('/api/admin/catalog', { cache: 'no-store' })
        const result: unknown = await response.json()
        if (!response.ok) throw new Error(getErrorMessage(result, 'Não foi possível carregar o catálogo.'))
        if (!isStoreCatalog(result)) throw new Error('O servidor retornou um catálogo inválido.')

        if (active) {
          setCatalog(result)
          setSavedSnapshot(JSON.stringify(result))
          setSelectedCategoryId(result.categories[0]?.id ?? '')
        }
      } catch (error) {
        if (active) {
          setNotice({
            kind: 'error',
            message: error instanceof Error ? error.message : 'Erro inesperado ao carregar o catálogo.',
          })
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadCatalog()
    return () => {
      active = false
    }
  }, [])

  const selectedCategory = catalog?.categories.find(
    (category) => category.id === selectedCategoryId,
  )
  const isDirty = Boolean(catalog && JSON.stringify(catalog) !== savedSnapshot)

  function updateCatalog(updater: (current: StoreCatalog) => StoreCatalog) {
    setCatalog((current) => (current ? updater(current) : current))
    setNotice(null)
  }

  function updateCategory(categoryId: string, patch: Partial<StoreCategory>) {
    updateCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId ? { ...category, ...patch } : category,
      ),
    }))
  }

  function updateProduct(
    categoryId: string,
    productId: string,
    patch: Partial<StoreProduct>,
  ) {
    updateCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: category.products.map((product) =>
                product.id === productId ? { ...product, ...patch } : product,
              ),
            }
          : category,
      ),
    }))
  }

  function updateVariant(
    categoryId: string,
    productId: string,
    variantId: string,
    patch: Partial<StoreVariant>,
  ) {
    updateCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: category.products.map((product) =>
                product.id === productId
                  ? {
                      ...product,
                      variants: product.variants.map((variant) =>
                        variant.id === variantId ? { ...variant, ...patch } : variant,
                      ),
                    }
                  : product,
              ),
            }
          : category,
      ),
    }))
  }

  function addCategory() {
    const category: StoreCategory = {
      id: createId('categoria'),
      title: 'Nova categoria',
      detail: 'Descreva esta categoria para os clientes.',
      message: 'Olá! Quero consultar as opções disponíveis.',
      icon: 'smartphone',
      active: true,
      variantLabel: 'Opção',
      allowTradeIn: false,
      products: [],
    }

    updateCatalog((current) => ({ ...current, categories: [...current.categories, category] }))
    setSelectedCategoryId(category.id)
  }

  function removeCategory(categoryId: string) {
    const category = catalog?.categories.find((entry) => entry.id === categoryId)
    if (!category || !window.confirm(`Remover a categoria "${category.title}" e todos os seus produtos?`)) {
      return
    }

    const remaining = catalog?.categories.filter((entry) => entry.id !== categoryId) ?? []
    updateCatalog((current) => ({
      ...current,
      categories: current.categories.filter((entry) => entry.id !== categoryId),
    }))
    setSelectedCategoryId(remaining[0]?.id ?? '')
  }

  function addProduct(categoryId: string) {
    const product: StoreProduct = {
      id: createId('produto'),
      name: 'Novo produto',
      detail: '',
      active: true,
      requireDetails: false,
      variants: [
        {
          id: createId('opcao'),
          label: 'Padrão',
          active: true,
          price: null,
          stock: null,
        },
      ],
    }

    updateCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId
          ? { ...category, products: [...category.products, product] }
          : category,
      ),
    }))
  }

  function removeProduct(categoryId: string, productId: string) {
    const product = selectedCategory?.products.find((entry) => entry.id === productId)
    if (!product || !window.confirm(`Remover "${product.name}" e todas as suas opções?`)) return

    updateCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: category.products.filter((entry) => entry.id !== productId),
            }
          : category,
      ),
    }))
  }

  function addVariant(categoryId: string, productId: string) {
    const variant: StoreVariant = {
      id: createId('opcao'),
      label: 'Nova opção',
      active: true,
      price: null,
      stock: null,
    }
    const product = selectedCategory?.products.find((entry) => entry.id === productId)
    if (!product) return

    updateProduct(categoryId, productId, {
      variants: [...product.variants, variant],
    })
  }

  function removeVariant(categoryId: string, productId: string, variantId: string) {
    const product = selectedCategory?.products.find((entry) => entry.id === productId)
    if (!product) return

    updateProduct(categoryId, productId, {
      variants: product.variants.filter((variant) => variant.id !== variantId),
    })
  }

  async function saveCatalog() {
    if (!catalog) return
    if (!isStoreCatalog(catalog)) {
      setNotice({
        kind: 'error',
        message: 'Revise os campos obrigatórios, os valores e os IDs antes de salvar.',
      })
      return
    }

    setIsSaving(true)
    setNotice(null)
    const snapshot = JSON.stringify(catalog)

    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: snapshot,
      })
      const result: unknown = await response.json()
      if (!response.ok) throw new Error(getErrorMessage(result, 'Não foi possível salvar.'))

      setSavedSnapshot(snapshot)
      setNotice({ kind: 'success', message: 'Catálogo salvo e publicado.' })
      router.refresh()
    } catch (error) {
      setNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Erro inesperado ao salvar o catálogo.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function logout() {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/admin/auth', { method: 'DELETE' })
      if (!response.ok) throw new Error('Não foi possível encerrar a sessão.')
      router.refresh()
    } catch (error) {
      setNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Erro inesperado ao sair do painel.',
      })
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
        Carregando catálogo...
      </div>
    )
  }

  if (!catalog) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm">
        {notice?.message ?? 'Não foi possível carregar o catálogo.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-[1.75rem] border border-border bg-card/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Gestão da loja
          </p>
          <h2 className="mt-2 font-display text-3xl">Catálogo e estoque</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre opções e valores; alterações só aparecem na loja após salvar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </button>
          <button
            type="button"
            onClick={saveCatalog}
            disabled={!isDirty || isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </header>

      {notice && (
        <p
          role={notice.kind === 'error' ? 'alert' : 'status'}
          className={
            notice.kind === 'error'
              ? 'rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm'
              : 'rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200'
          }
        >
          {notice.message}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="self-start rounded-[1.5rem] border border-border bg-card/70 p-4 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-3 px-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Categorias
            </h3>
            <span className="text-xs text-muted-foreground">{catalog.categories.length}</span>
          </div>
          <div className="space-y-1">
            {catalog.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                  category.id === selectedCategoryId
                    ? 'bg-primary/10 font-semibold text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className="truncate">{category.title}</span>
                <span className="shrink-0 text-xs">{category.products.length}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-primary/5"
          >
            <Plus className="size-4" aria-hidden="true" />
            Nova categoria
          </button>
        </aside>

        {selectedCategory ? (
          <div className="min-w-0 space-y-5">
            <section className="rounded-[1.5rem] border border-border bg-card/70 p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Configurações
                  </p>
                  <h3 className="mt-2 font-display text-2xl">{selectedCategory.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(selectedCategory.id)}
                  aria-label={`Remover categoria ${selectedCategory.title}`}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category-title" className="mb-2 block text-sm font-medium">
                    Nome da categoria
                  </label>
                  <input
                    id="category-title"
                    maxLength={80}
                    value={selectedCategory.title}
                    onChange={(event) =>
                      updateCategory(selectedCategory.id, { title: event.currentTarget.value })
                    }
                    className={INPUT_CLASS_NAME}
                  />
                </div>
                <div>
                  <label htmlFor="category-icon" className="mb-2 block text-sm font-medium">
                    Ícone
                  </label>
                  <select
                    id="category-icon"
                    value={selectedCategory.icon}
                    onChange={(event) => {
                      const icon = STORE_ICON_OPTIONS.find(
                        (option) => option === event.currentTarget.value,
                      )
                      if (icon) updateCategory(selectedCategory.id, { icon })
                    }}
                    className={INPUT_CLASS_NAME}
                  >
                    {STORE_ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="category-detail" className="mb-2 block text-sm font-medium">
                    Descrição para a vitrine
                  </label>
                  <input
                    id="category-detail"
                    maxLength={250}
                    value={selectedCategory.detail}
                    onChange={(event) =>
                      updateCategory(selectedCategory.id, { detail: event.currentTarget.value })
                    }
                    className={INPUT_CLASS_NAME}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="category-message" className="mb-2 block text-sm font-medium">
                    Mensagem inicial do WhatsApp
                  </label>
                  <textarea
                    id="category-message"
                    maxLength={500}
                    rows={2}
                    value={selectedCategory.message}
                    onChange={(event) =>
                      updateCategory(selectedCategory.id, { message: event.currentTarget.value })
                    }
                    className={`${INPUT_CLASS_NAME} resize-y`}
                  />
                </div>
                <div>
                  <label htmlFor="category-variant-label" className="mb-2 block text-sm font-medium">
                    Nome das opções
                  </label>
                  <input
                    id="category-variant-label"
                    maxLength={80}
                    value={selectedCategory.variantLabel}
                    onChange={(event) =>
                      updateCategory(selectedCategory.id, {
                        variantLabel: event.currentTarget.value,
                      })
                    }
                    className={INPUT_CLASS_NAME}
                  />
                </div>
                <div className="flex flex-col justify-end gap-3">
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategory.active}
                      onChange={(event) =>
                        updateCategory(selectedCategory.id, { active: event.currentTarget.checked })
                      }
                      className="size-4 accent-primary"
                    />
                    Categoria visível na loja
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategory.allowTradeIn}
                      onChange={(event) =>
                        updateCategory(selectedCategory.id, {
                          allowTradeIn: event.currentTarget.checked,
                        })
                      }
                      className="size-4 accent-primary"
                    />
                    Permitir consulta de troca
                  </label>
                </div>
              </div>
            </section>

            <section
              className={`rounded-[1.5rem] border border-border bg-card/70 p-5 sm:p-7 ${
                isConfiguratorCategory(selectedCategory.id) ? '' : 'hidden'
              }`}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Estoque e opções
                  </p>
                  <h3 className="mt-2 font-display text-2xl">Produtos da categoria</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addProduct(selectedCategory.id)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Adicionar produto
                </button>
              </div>

              {selectedCategory.products.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Ainda não há produtos nesta categoria. Adicione um para habilitar a seleção na loja.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedCategory.products.map((product, productIndex) => (
                    <details
                      key={product.id}
                      className="group rounded-2xl border border-border/80 bg-background/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{product.name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {product.variants.length} opç
                            {product.variants.length === 1 ? 'ão' : 'ões'}
                            {!product.active ? ' · Oculto na loja' : ''}
                          </span>
                        </span>
                        <ChevronDown
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>

                      <div className="space-y-5 border-t border-border/70 p-4 sm:p-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeProduct(selectedCategory.id, product.id)}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            Remover produto
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`${product.id}-name`}
                              className="mb-2 block text-sm font-medium"
                            >
                              Nome do produto/modelo
                            </label>
                            <input
                              id={`${product.id}-name`}
                              maxLength={100}
                              value={product.name}
                              onChange={(event) =>
                                updateProduct(selectedCategory.id, product.id, {
                                  name: event.currentTarget.value,
                                })
                              }
                              className={INPUT_CLASS_NAME}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${product.id}-detail`}
                              className="mb-2 block text-sm font-medium"
                            >
                              Descrição adicional
                            </label>
                            <input
                              id={`${product.id}-detail`}
                              maxLength={300}
                              value={product.detail}
                              onChange={(event) =>
                                updateProduct(selectedCategory.id, product.id, {
                                  detail: event.currentTarget.value,
                                })
                              }
                              className={INPUT_CLASS_NAME}
                            />
                          </div>
                          <label className="flex items-center gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={product.active}
                              onChange={(event) =>
                                updateProduct(selectedCategory.id, product.id, {
                                  active: event.currentTarget.checked,
                                })
                              }
                              className="size-4 accent-primary"
                            />
                            Produto visível na loja
                          </label>
                          <label className="flex items-center gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={product.requireDetails}
                              onChange={(event) =>
                                updateProduct(selectedCategory.id, product.id, {
                                  requireDetails: event.currentTarget.checked,
                                })
                              }
                              className="size-4 accent-primary"
                            />
                            Exigir observações do cliente
                          </label>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h4 className="text-sm font-semibold">
                              {selectedCategory.variantLabel}, preço e quantidade
                            </h4>
                            <button
                              type="button"
                              onClick={() => addVariant(selectedCategory.id, product.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-foreground"
                            >
                              <Plus className="size-4" aria-hidden="true" />
                              Adicionar opção
                            </button>
                          </div>

                          {product.variants.map((variant, variantIndex) => (
                            <div
                              key={variant.id}
                              className="grid gap-3 rounded-xl border border-border/70 bg-card/50 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_9rem_7rem_auto_auto]"
                            >
                              <div>
                                <label
                                  htmlFor={`${variant.id}-label`}
                                  className="mb-1.5 block text-xs text-muted-foreground"
                                >
                                  Opção {variantIndex + 1}
                                </label>
                                <input
                                  id={`${variant.id}-label`}
                                  maxLength={80}
                                  value={variant.label}
                                  onChange={(event) =>
                                    updateVariant(selectedCategory.id, product.id, variant.id, {
                                      label: event.currentTarget.value,
                                    })
                                  }
                                  className={INPUT_CLASS_NAME}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`${variant.id}-price`}
                                  className="mb-1.5 block text-xs text-muted-foreground"
                                >
                                  Preço (R$)
                                </label>
                                <input
                                  id={`${variant.id}-price`}
                                  type="number"
                                  min="0"
                                  max="100000000"
                                  step="0.01"
                                  value={variant.price ?? ''}
                                  onChange={(event) => {
                                    const value = event.currentTarget.value
                                    const price = parseOptionalNumber(value)
                                    if (value && price === null) {
                                      setNotice({
                                        kind: 'error',
                                        message: 'Informe um preço entre R$ 0 e R$ 100.000.000.',
                                      })
                                      return
                                    }
                                    updateVariant(selectedCategory.id, product.id, variant.id, {
                                      price,
                                    })
                                  }}
                                  className={INPUT_CLASS_NAME}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`${variant.id}-stock`}
                                  className="mb-1.5 block text-xs text-muted-foreground"
                                >
                                  Quantidade
                                </label>
                                <input
                                  id={`${variant.id}-stock`}
                                  type="number"
                                  min="0"
                                  max="10000000"
                                  step="1"
                                  value={variant.stock ?? ''}
                                  onChange={(event) => {
                                    const value = event.currentTarget.value
                                    const stock = parseOptionalStock(value)
                                    if (value && stock === null) {
                                      setNotice({
                                        kind: 'error',
                                        message:
                                          'A quantidade deve ser um inteiro entre 0 e 10.000.000.',
                                      })
                                      return
                                    }
                                    updateVariant(selectedCategory.id, product.id, variant.id, {
                                      stock,
                                    })
                                  }}
                                  className={INPUT_CLASS_NAME}
                                />
                              </div>
                              <label className="flex items-center gap-2 self-end pb-3 text-xs">
                                <input
                                  type="checkbox"
                                  checked={variant.active}
                                  onChange={(event) =>
                                    updateVariant(selectedCategory.id, product.id, variant.id, {
                                      active: event.currentTarget.checked,
                                    })
                                  }
                                  className="size-4 accent-primary"
                                />
                                Ativa
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariant(selectedCategory.id, product.id, variant.id)
                                }
                                aria-label={`Remover opção ${variant.label}`}
                                className="flex size-10 items-center justify-center self-end rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </section>
            {!isConfiguratorCategory(selectedCategory.id) && (
              <section className="rounded-[1.5rem] border border-border bg-card/70 p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Atendimento direto
                </p>
                <h3 className="mt-2 font-display text-2xl">WhatsApp sem triagem</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  O botão desta categoria abre uma conversa no WhatsApp usando a mensagem inicial
                  configurada acima. O cliente não passa por seleção de produtos ou opções.
                </p>
              </section>
            )}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border p-8 text-sm text-muted-foreground">
            Crie uma categoria para começar a montar o catálogo.
          </div>
        )}
      </div>
    </div>
  )
}
