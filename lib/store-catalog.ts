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
  seedVersion?: number
}

const CONFIGURATOR_CATEGORY_IDS: ReadonlySet<string> = new Set([
  'iphone',
  'xiaomi-poco',
  'apple-watch',
  'macbook',
  'assistencia-tecnica',
  'eletronicos-acessorios',
  'troque-seu-usado',
])

export function isConfiguratorCategory(categoryId: string) {
  return CONFIGURATOR_CATEGORY_IDS.has(categoryId)
}

export function canOpenConfigurator(category: Pick<StoreCategory, 'id' | 'products'>) {
  return (
    isConfiguratorCategory(category.id) &&
    (category.id === 'assistencia-tecnica' ||
      category.products.some((product) => product.active))
  )
}

const IPHONE_STORAGE_OPTIONS = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB']
const IPHONE_MODELS_ADDED_IN_SEED_V2 = [
  'iPhone 16e',
  'iPhone 17',
  'iPhone 17 Pro',
  'iPhone 17 Pro Max',
  'iPhone Air',
  'iPhone 17e',
  'iPhone 18 Pro',
  'iPhone 18 Pro Max',
  'iPhone Duo',
]
const IPHONE_MODELS = [
  'iPhone 11',
  'iPhone 11 Pro',
  'iPhone 11 Pro Max',
  'iPhone 12 mini',
  'iPhone 12',
  'iPhone 12 Pro',
  'iPhone 12 Pro Max',
  'iPhone 13 mini',
  'iPhone 13',
  'iPhone 13 Pro',
  'iPhone 13 Pro Max',
  'iPhone 14',
  'iPhone 14 Plus',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15',
  'iPhone 15 Plus',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16',
  'iPhone 16 Plus',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max',
  ...IPHONE_MODELS_ADDED_IN_SEED_V2,
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

function createPricedStoreProduct(
  name: string,
  options: Array<{ label: string; price: number | null }>,
): StoreProduct {
  const productId = createId(name)
  return {
    id: productId,
    name,
    detail: '',
    active: true,
    requireDetails: false,
    variants: options.map(({ label, price }) => ({
      id: `${productId}-${createId(label)}`,
      label,
      active: true,
      price,
      stock: null,
    })),
  }
}

const CATALOG_SEED_VERSION = 2
const MACBOOK_PRODUCTS = [
  createPricedStoreProduct('Mac mini M2 8/256 GB', [{ label: 'Padrão', price: 3650 }]),
  createPricedStoreProduct('Mac mini M2 8/512 GB', [{ label: 'Silver', price: 3800 }]),
  createPricedStoreProduct('Mac mini M4 16/512 GB', [{ label: 'Padrão', price: 5950 }]),
  createPricedStoreProduct('Mac mini M6 16/256 GB', [{ label: 'Padrão', price: 6350 }]),
  createPricedStoreProduct('MacBook Neo 13” 8/256 GB', [
    { label: 'Azul', price: 5150 },
    { label: 'Silver', price: 5300 },
  ]),
  createPricedStoreProduct('MacBook Neo 13” 8/512 GB', [
    { label: 'Azul', price: 5850 },
    { label: 'Silver', price: 5900 },
  ]),
  createPricedStoreProduct('MacBook Air M4 13” 16 GB/512 GB', [
    { label: 'Midnight', price: 7850 },
  ]),
  createPricedStoreProduct('MacBook Air M5 13” 16 GB/512 GB', [
    { label: 'Starlight', price: 8350 },
    { label: 'Midnight', price: 8350 },
    { label: 'Sky Blue', price: 8350 },
    { label: 'Silver', price: 8350 },
  ]),
  createPricedStoreProduct('MacBook Air M5 13” 16 GB/1 TB', [
    { label: 'Midnight', price: 10590 },
    { label: 'Starlight', price: 10590 },
    { label: 'Sky Blue', price: 10590 },
  ]),
  createPricedStoreProduct('MacBook M5 Pro Chip Pro 16” 24 GB/1 TB', [
    { label: 'Space Black', price: 19800 },
  ]),
  createPricedStoreProduct('MacBook Air M5 13” 16 GB/512 GB Open Box', [
    { label: 'Midnight', price: 8100 },
  ]),
  createPricedStoreProduct('MacBook Air M5 13” 16 GB/512 GB STAR (sem lacre)', [
    { label: 'STAR — sem lacre', price: 8600 },
  ]),
]

export const DEFAULT_CATALOG: StoreCatalog = {
  seedVersion: CATALOG_SEED_VERSION,
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
        ...IPHONE_MODELS.map((name) => createStoreProduct(name, IPHONE_STORAGE_OPTIONS)),
        createStoreProduct('Outro modelo', IPHONE_STORAGE_OPTIONS, true),
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
      variantLabel: 'Cor',
      allowTradeIn: false,
      products: [
        createPricedStoreProduct('Apple Watch SE 3 40 mm', [
          { label: 'Starlight', price: null },
          { label: 'Midnight', price: null },
        ]),
        createPricedStoreProduct('Apple Watch SE 3 44 mm', [
          { label: 'Midnight', price: null },
        ]),
        createPricedStoreProduct('Apple Watch S11 42 mm', [{ label: 'Rosa', price: null }]),
        createPricedStoreProduct('Apple Watch S11 46 mm', [{ label: 'Silver', price: null }]),
        createPricedStoreProduct('Apple Watch S12 42 mm', [
          { label: 'Light Gold com pulseira Black Sport', price: null },
          { label: 'Dark Bronze', price: null },
        ]),
        createPricedStoreProduct('Apple Watch S12 46 mm', [
          { label: 'Black', price: null },
          { label: 'Dark Bronze', price: null },
        ]),
        createPricedStoreProduct('Apple Watch Ultra 4', [{ label: 'Black', price: null }]),
      ],
    },
    {
      id: 'macbook',
      title: 'MacBook',
      detail: 'Consulte os modelos disponíveis.',
      message: 'Olá! Quero consultar os MacBooks disponíveis.',
      icon: 'laptop',
      active: true,
      variantLabel: 'Cor / edição',
      allowTradeIn: false,
      products: MACBOOK_PRODUCTS,
    },
    {
      id: 'eletronicos-acessorios',
      title: 'Eletrônicos & acessórios',
      detail: 'Encontre acessórios para seus dispositivos.',
      message: 'Olá! Quero conhecer os eletrônicos e acessórios disponíveis.',
      icon: 'cable',
      active: true,
      variantLabel: 'Tipo de acessório',
      allowTradeIn: false,
      products: [
        createStoreProduct('Capinha', [], true),
        createStoreProduct('Película', [], true),
        createStoreProduct('Fones', [], true),
        createStoreProduct('Relógios', [], true),
        createStoreProduct('Cabos', [], true),
        createStoreProduct('Fontes', [], true),
        createStoreProduct('Outros', [], true),
      ],
    },
    {
      id: 'assistencia-tecnica',
      title: 'Assistência técnica',
      detail: 'Selecione o modelo do aparelho e descreva o problema.',
      message: 'Olá! Gostaria de solicitar assistência técnica para o meu aparelho.',
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

function normalizeCatalogName(value: string) {
  return value.trim().toLocaleLowerCase('pt-BR')
}

function normalizeLegacyAccessoryName(category: StoreCategory): StoreCategory {
  if (category.id !== 'eletronicos-acessorios') return category

  const legacyName = 'Outro eletrônico ou acessório'
  const normalizedProducts = category.products.map((product) =>
    product.id === createId(legacyName) ||
    normalizeCatalogName(product.name) === normalizeCatalogName(legacyName)
      ? { ...product, name: 'Outros' }
      : product,
  )
  const otherProducts = normalizedProducts.filter(
    (product) => normalizeCatalogName(product.name) === 'outros',
  )
  const moveOtherLast = (products: StoreProduct[]) => [
    ...products.filter((product) => normalizeCatalogName(product.name) !== 'outros'),
    ...products.filter((product) => normalizeCatalogName(product.name) === 'outros'),
  ]
  if (otherProducts.length <= 1) {
    const changed = normalizedProducts.some(
      (product, index) => product !== category.products[index],
    )
    return changed ? { ...category, products: moveOtherLast(normalizedProducts) } : category
  }

  const canonicalOther =
    otherProducts.find((product) => product.id === createId('Outros')) ?? otherProducts[0]
  const mergedOther = otherProducts
    .filter((product) => product !== canonicalOther)
    .reduce(
      (existing, duplicate) =>
        mergeSeedProduct(
          {
            ...existing,
            detail: existing.detail || duplicate.detail,
            active: existing.active && duplicate.active,
            requireDetails: existing.requireDetails || duplicate.requireDetails,
          },
          {
            ...duplicate,
            variants: duplicate.variants.filter(
              (variant) => variant.label !== 'A confirmar com a equipe',
            ),
          },
        ),
      canonicalOther,
    )
  let insertedCanonical = false
  const products = normalizedProducts.filter((product) => {
    if (normalizeCatalogName(product.name) !== 'outros') return true
    if (insertedCanonical) return false
    insertedCanonical = true
    return true
  }).map((product) =>
    normalizeCatalogName(product.name) === 'outros' ? mergedOther : product,
  )

  return { ...category, products: moveOtherLast(products) }
}

function isUntouchedLegacyPlaceholder(categoryId: string, product: StoreProduct) {
  const placeholderNames: Record<string, string> = {
    'apple-watch': 'Outro modelo Apple Watch',
    macbook: 'Outro modelo MacBook',
    'eletronicos-acessorios': 'Outro eletrônico ou acessório',
  }
  const name = placeholderNames[categoryId]
  if (
    !name ||
    product.id !== createId(name) ||
    product.name !== name ||
    product.detail !== '' ||
    !product.active ||
    !product.requireDetails ||
    product.variants.length !== 1
  ) {
    return false
  }

  const [variant] = product.variants
  return (
    variant.id === `${product.id}-${createId('A confirmar com a equipe')}` &&
    variant.label === 'A confirmar com a equipe' &&
    variant.active &&
    variant.price === null &&
    variant.stock === null
  )
}

function mergeSeedProduct(existing: StoreProduct, seeded: StoreProduct): StoreProduct {
  const variants = [...existing.variants]
  for (const seededVariant of seeded.variants) {
    const alreadyExists = variants.some(
      (variant) =>
        variant.id === seededVariant.id ||
        normalizeCatalogName(variant.label) === normalizeCatalogName(seededVariant.label),
    )
    if (!alreadyExists) variants.push(seededVariant)
  }

  return { ...seeded, ...existing, variants }
}

function addMissingIPhoneModels(category: StoreCategory): StoreCategory {
  const existingProducts = new Set(
    category.products.flatMap((product) => [
      product.id,
      normalizeCatalogName(product.name),
    ]),
  )
  const additions = IPHONE_MODELS_ADDED_IN_SEED_V2
    .filter(
      (name) =>
        !existingProducts.has(createId(name)) &&
        !existingProducts.has(normalizeCatalogName(name)),
    )
    .map((name) => createStoreProduct(name, IPHONE_STORAGE_OPTIONS))

  if (additions.length === 0) return category

  const products = [...category.products]
  const otherModelIndex = products.findIndex(
    (product) =>
      product.id === createId('Outro modelo') ||
      normalizeCatalogName(product.name) === normalizeCatalogName('Outro modelo'),
  )
  products.splice(otherModelIndex < 0 ? products.length : otherModelIndex, 0, ...additions)
  return { ...category, products }
}

export function migrateStoreCatalog(catalog: StoreCatalog): StoreCatalog {
  const categories = catalog.categories.map(normalizeLegacyAccessoryName)
  const seedVersion = catalog.seedVersion ?? 0
  if (seedVersion >= CATALOG_SEED_VERSION) {
    return categories.some((category, index) => category !== catalog.categories[index])
      ? { ...catalog, categories }
      : catalog
  }

  if (seedVersion === 1) {
    return {
      ...catalog,
      seedVersion: CATALOG_SEED_VERSION,
      categories: categories.map((category) =>
        category.id === 'iphone' ? addMissingIPhoneModels(category) : category,
      ),
    }
  }

  const legacyVariantLabels: Record<string, string> = {
    'apple-watch': 'Tamanho / versão',
    macbook: 'Memória / armazenamento',
    'eletronicos-acessorios': 'Cor / versão',
  }

  return {
    ...catalog,
    seedVersion: CATALOG_SEED_VERSION,
    categories: categories.map((category) => {
      const seedCategory = DEFAULT_CATALOG.categories.find(
        (entry) => entry.id === category.id,
      )
      if (!seedCategory) return category

      const remainingProducts = category.products.filter(
        (product) => !isUntouchedLegacyPlaceholder(category.id, product),
      )

      const products: StoreProduct[] = []
      for (const seededProduct of seedCategory.products) {
        const existingIndex = remainingProducts.findIndex(
          (product) =>
            product.id === seededProduct.id ||
            normalizeCatalogName(product.name) === normalizeCatalogName(seededProduct.name),
        )
        if (existingIndex < 0) {
          products.push(seededProduct)
        } else {
          products.push(
            mergeSeedProduct(remainingProducts[existingIndex], seededProduct),
          )
          remainingProducts.splice(existingIndex, 1)
        }
      }

      return {
        ...category,
        variantLabel:
          category.variantLabel === legacyVariantLabels[category.id]
            ? seedCategory.variantLabel
            : category.variantLabel,
        products: [...products, ...remainingProducts],
      }
    }),
  }
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
  if (
    !isRecord(value) ||
    !Array.isArray(value.categories) ||
    value.categories.length > 50 ||
    (value.seedVersion !== undefined &&
      (typeof value.seedVersion !== 'number' ||
        !Number.isSafeInteger(value.seedVersion) ||
        value.seedVersion < 0))
  ) {
    return false
  }

  const categories: unknown[] = value.categories
  if (!categories.every(isStoreCategory)) return false

  const categoryIds = categories.map((category) =>
    isStoreCategory(category) ? category.id : null,
  )
  return new Set(categoryIds).size === categories.length
}
