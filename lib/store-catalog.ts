export const STORE_ICON_OPTIONS = [
  'smartphone',
  'watch',
  'laptop',
  'cable',
  'wrench',
  'refresh',
  'headphones',
] as const

export type StoreIcon = (typeof STORE_ICON_OPTIONS)[number]

export type StoreVariant = {
  id: string
  label: string
  active: boolean
  price: number | null
  stock: number | null
}

export type StoreProduct = {
  id: string
  name: string
  detail: string
  active: boolean
  requireDetails: boolean
  variants: StoreVariant[]
}

export type StoreCategory = {
  id: string
  title: string
  detail: string
  message: string
  icon: StoreIcon
  active: boolean
  variantLabel: string
  allowTradeIn: boolean
  products: StoreProduct[]
}

export type StoreCatalog = {
  categories: StoreCategory[]
}

const CONFIGURATOR_CATEGORY_IDS: ReadonlySet<string> = new Set([
  'iphone',
  'xiaomi-poco',
  'apple-watch',
  'macbook',
  'eletronicos-acessorios',
  'troque-seu-usado',
])

export function isConfiguratorCategory(categoryId: string) {
  return CONFIGURATOR_CATEGORY_IDS.has(categoryId)
}

const IPHONE_MODELS = [
  { name: 'iPhone 11', capacities: ['64 GB', '128 GB', '256 GB'] },
  { name: 'iPhone 11 Pro', capacities: ['64 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 11 Pro Max', capacities: ['64 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 12 mini', capacities: ['64 GB', '128 GB', '256 GB'] },
  { name: 'iPhone 12', capacities: ['64 GB', '128 GB', '256 GB'] },
  { name: 'iPhone 12 Pro', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 12 Pro Max', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 13 mini', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 13', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 13 Pro', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 13 Pro Max', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 14', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 14 Plus', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 14 Pro', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 14 Pro Max', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 15', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 15 Plus', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 15 Pro', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 15 Pro Max', capacities: ['256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 16', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 16 Plus', capacities: ['128 GB', '256 GB', '512 GB'] },
  { name: 'iPhone 16 Pro', capacities: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  { name: 'iPhone 16 Pro Max', capacities: ['256 GB', '512 GB', '1 TB'] },
]

function createId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createStoreProduct(name: string, options: string[], requireDetails = false): StoreProduct {
  const productId = createId(name)
  return {
    id: productId,
    name,
    detail: '',
    active: true,
    requireDetails,
    variants: options.map((label) => ({
      id: `${productId}-${createId(label)}`,
      label,
      active: true,
      price: null,
      stock: null,
    })),
  }
}

export const DEFAULT_CATALOG: StoreCatalog = {
  categories: [
    {
      id: 'iphone',
      title: 'iPhone',
      detail: 'Escolha o modelo e o armazenamento para consultar.',
      message: 'Olá! Quero consultar os iPhones novos e seminovos disponíveis.',
      icon: 'smartphone',
      active: true,
      variantLabel: 'Armazenamento',
      allowTradeIn: true,
      products: [
        ...IPHONE_MODELS.map(({ name, capacities }) => createStoreProduct(name, capacities)),
        createStoreProduct('Outro modelo', ['A confirmar com a equipe'], true),
      ],
    },
    {
      id: 'xiaomi-poco',
      title: 'Xiaomi & POCO',
      detail: 'Celulares e novidades das linhas Xiaomi e POCO.',
      message: 'Olá! Quero consultar os celulares Xiaomi e POCO disponíveis.',
      icon: 'smartphone',
      active: true,
      variantLabel: 'Armazenamento / versão',
      allowTradeIn: false,
      products: [
        createStoreProduct('Outro modelo Xiaomi / POCO', ['A confirmar com a equipe'], true),
      ],
    },
    {
      id: 'apple-watch',
      title: 'Apple Watch',
      detail: 'Relógios e acessórios para o seu dia a dia.',
      message: 'Olá! Quero consultar Apple Watch e acessórios disponíveis.',
      icon: 'watch',
      active: true,
      variantLabel: 'Tamanho / versão',
      allowTradeIn: false,
      products: [createStoreProduct('Outro modelo Apple Watch', ['A confirmar com a equipe'], true)],
    },
    {
      id: 'macbook',
      title: 'MacBook',
      detail: 'Consulte os modelos disponíveis.',
      message: 'Olá! Quero consultar os MacBooks disponíveis.',
      icon: 'laptop',
      active: true,
      variantLabel: 'Memória / armazenamento',
      allowTradeIn: false,
      products: [createStoreProduct('Outro modelo MacBook', ['A confirmar com a equipe'], true)],
    },
    {
      id: 'eletronicos-acessorios',
      title: 'Eletrônicos & acessórios',
      detail: 'Encontre acessórios para seus dispositivos.',
      message: 'Olá! Quero conhecer os eletrônicos e acessórios disponíveis.',
      icon: 'cable',
      active: true,
      variantLabel: 'Cor / versão',
      allowTradeIn: false,
      products: [createStoreProduct('Outro eletrônico ou acessório', ['A confirmar com a equipe'], true)],
    },
    {
      id: 'assistencia-tecnica',
      title: 'Assistência técnica',
      detail: 'Atendimento técnico especializado.',
      message: 'Olá! Preciso de informações sobre assistência técnica.',
      icon: 'wrench',
      active: true,
      variantLabel: 'Serviço',
      allowTradeIn: false,
      products: [],
    },
    {
      id: 'troque-seu-usado',
      title: 'Troque seu usado',
      detail: 'Consulte a avaliação do seu aparelho na troca.',
      message: 'Olá! Quero avaliar meu aparelho para uma troca.',
      icon: 'refresh',
      active: true,
      variantLabel: 'Modelo',
      allowTradeIn: false,
      products: [
        {
          ...createStoreProduct('Avaliação de aparelho usado', ['A confirmar com a equipe'], true),
          detail:
            'Informe modelo, armazenamento, estado de conservação e defeitos conhecidos para solicitar uma avaliação.',
        },
      ],
    },
  ],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength
}

function isOptionalPrice(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100_000_000)
  )
}

function isOptionalStock(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 10_000_000)
  )
}

function isId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value)
}

function isStoreIcon(value: unknown): value is StoreIcon {
  return typeof value === 'string' && STORE_ICON_OPTIONS.some((icon) => icon === value)
}

function isStoreVariant(value: unknown): value is StoreVariant {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isNonEmptyString(value.label, 80) &&
    typeof value.active === 'boolean' &&
    isOptionalPrice(value.price) &&
    isOptionalStock(value.stock)
  )
}

function isStoreProduct(value: unknown): value is StoreProduct {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isNonEmptyString(value.name, 100) ||
    typeof value.detail !== 'string' ||
    value.detail.length > 300 ||
    typeof value.active !== 'boolean' ||
    typeof value.requireDetails !== 'boolean' ||
    !Array.isArray(value.variants) ||
    value.variants.length > 100
  ) {
    return false
  }

  const variants: unknown[] = value.variants
  if (!variants.every(isStoreVariant)) return false

  const variantIds = variants.map((variant) =>
    isStoreVariant(variant) ? variant.id : null,
  )
  return new Set(variantIds).size === variants.length
}

function isStoreCategory(value: unknown): value is StoreCategory {
  if (
    !isRecord(value) ||
    !isId(value.id) ||
    !isNonEmptyString(value.title, 80) ||
    !isNonEmptyString(value.detail, 250) ||
    !isNonEmptyString(value.message, 500) ||
    !isStoreIcon(value.icon) ||
    typeof value.active !== 'boolean' ||
    !isNonEmptyString(value.variantLabel, 80) ||
    typeof value.allowTradeIn !== 'boolean' ||
    !Array.isArray(value.products) ||
    value.products.length > 300
  ) {
    return false
  }

  const products: unknown[] = value.products
  if (!products.every(isStoreProduct)) return false

  const productIds = products.map((product) =>
    isStoreProduct(product) ? product.id : null,
  )
  return new Set(productIds).size === products.length
}

export function isStoreCatalog(value: unknown): value is StoreCatalog {
  if (!isRecord(value) || !Array.isArray(value.categories) || value.categories.length > 50) {
    return false
  }

  const categories: unknown[] = value.categories
  if (!categories.every(isStoreCategory)) return false

  const categoryIds = categories.map((category) =>
    isStoreCategory(category) ? category.id : null,
  )
  return new Set(categoryIds).size === categories.length
}
