'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  HardDrive,
  RefreshCw,
  Smartphone,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { WhatsappIcon } from '@/components/brand-icons'
import { formatBRL, whatsappUrl } from '@/lib/store-config'
import type { StoreCategory } from '@/lib/store-catalog'

const FIELD_CLASS_NAME =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

export function CategoryConfigurator({ category }: { category: StoreCategory }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [notes, setNotes] = useState('')
  const [hasTradeIn, setHasTradeIn] = useState(false)
  const [tradeInModel, setTradeInModel] = useState('')
  const [tradeInStorage, setTradeInStorage] = useState('')
  const [tradeInDetails, setTradeInDetails] = useState('')
  const [tradeInBattery, setTradeInBattery] = useState('')
  const [tradeInColor, setTradeInColor] = useState('')
  const [tradeInOriginalBox, setTradeInOriginalBox] = useState('')
  const [tradeInFaceIdWorking, setTradeInFaceIdWorking] = useState('')
  const [tradeInPartsReplaced, setTradeInPartsReplaced] = useState('')
  const [tradeInReplacedParts, setTradeInReplacedParts] = useState('')
  const [tradeInObservations, setTradeInObservations] = useState('')
  const isIPhone = category.id === 'iphone'
  const isAssistance = category.id === 'assistencia-tecnica'
  const [assistanceModel, setAssistanceModel] = useState('')

  const products = category.products.filter((product) => product.active)
  const usesManualAssistanceModel = isAssistance && products.length === 0
  const selectedProduct = products.find((product) => product.id === selectedProductId)
  const variants = selectedProduct?.variants.filter((variant) => variant.active) ?? []
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId)
  const productNeedsVariant = Boolean(selectedProduct?.variants.length)
  const hasSelection = usesManualAssistanceModel
    ? Boolean(assistanceModel.trim())
    : Boolean(
        selectedProduct && (!productNeedsVariant || selectedVariant),
      )
  const shouldShowProductDetails = Boolean(
    isAssistance || selectedProduct?.requireDetails,
  )
  const hasNoActiveVariants = Boolean(
    selectedProduct && productNeedsVariant && variants.length === 0,
  )
  const isOutOfStock = selectedVariant?.stock === 0
  const requiresProductDetails = isAssistance
    ? usesManualAssistanceModel || Boolean(selectedProduct?.requireDetails)
    : Boolean(selectedProduct?.requireDetails)
  const missingProductDetails = Boolean(
    requiresProductDetails && notes.trim().length < 4,
  )
  const missingTradeInDetails = Boolean(
    hasTradeIn &&
      (!tradeInModel.trim() ||
        tradeInDetails.trim().length < 8 ||
        (isIPhone &&
          (!tradeInStorage ||
            !tradeInBattery ||
            !tradeInColor.trim() ||
            !tradeInOriginalBox ||
            !tradeInFaceIdWorking ||
            !tradeInPartsReplaced ||
            (tradeInPartsReplaced === 'Sim' && !tradeInReplacedParts.trim())))),
  )
  const canSendInquiry = Boolean(
    hasSelection &&
      !isOutOfStock &&
      !missingProductDetails &&
      !missingTradeInDetails,
  )
  let disabledInquiryLabel = 'Escolha uma opção'
  if (usesManualAssistanceModel && !assistanceModel.trim()) {
    disabledInquiryLabel = 'Informe o modelo do aparelho'
  }
  if (missingProductDetails) {
    disabledInquiryLabel = isAssistance
      ? 'Descreva o problema'
      : 'Preencha os detalhes'
  }
  if (missingTradeInDetails) disabledInquiryLabel = 'Preencha os dados da troca'
  if (hasNoActiveVariants) disabledInquiryLabel = 'Sem opções disponíveis'
  if (isOutOfStock) disabledInquiryLabel = 'Opção sem estoque'

  const messageLines = isAssistance
    ? [
        category.message,
        'PEDIDO DE ASSISTÊNCIA TÉCNICA',
        `Modelo do aparelho: ${selectedProduct?.name ?? assistanceModel.trim()}`,
        ...(selectedVariant
          ? [`${category.variantLabel}: ${selectedVariant.label}`]
          : []),
        `O que aconteceu com o aparelho: ${notes.trim() || 'Não informado'}`,
      ]
    : [
        category.message,
        `Categoria: ${category.title}`,
        `Produto/modelo: ${selectedProduct?.name ?? ''}`,
        selectedVariant
          ? `${category.variantLabel}: ${selectedVariant.label}`
          : 'Opção: a confirmar com a equipe',
        selectedVariant?.price !== null && selectedVariant?.price !== undefined
          ? `Valor cadastrado: ${formatBRL(selectedVariant.price)}`
          : 'Gostaria de confirmar o valor atualizado.',
        `Tenho aparelho para troca: ${hasTradeIn ? 'Sim' : 'Não'}.`,
      ]

  if (!isAssistance && notes.trim()) {
    messageLines.push(`Observações: ${notes.trim()}`)
  }
  if (hasTradeIn) {
    messageLines.push(`Aparelho para troca: ${tradeInModel.trim()}`)
    messageLines.push(`Armazenamento do aparelho: ${tradeInStorage || 'Não informado'}`)

    if (isIPhone) {
      messageLines.push(
        `Saúde da bateria: ${tradeInBattery}`,
        `Cor: ${tradeInColor.trim()}`,
        `Caixa original: ${tradeInOriginalBox}`,
        `Detalhes do aparelho: ${tradeInDetails.trim()}`,
        `Face ID funciona: ${tradeInFaceIdWorking}`,
        tradeInPartsReplaced === 'Sim'
          ? `Peça trocada: Sim — ${tradeInReplacedParts.trim()}`
          : 'Peça trocada: Não',
      )
      if (tradeInObservations.trim()) {
        messageLines.push(`Observações da troca: ${tradeInObservations.trim()}`)
      }
    } else {
      messageLines.push(`Estado e características: ${tradeInDetails.trim()}`)
    }
  }

  const message = canSendInquiry ? messageLines.join('\n') : ''

  function handleProductChange(productId: string) {
    setSelectedProductId(productId)
    setSelectedVariantId('')
    setNotes('')
    setAssistanceModel('')
    setHasTradeIn(false)
    resetTradeInDetails()
  }

  function resetTradeInDetails() {
    setTradeInModel('')
    setTradeInStorage('')
    setTradeInDetails('')
    setTradeInBattery('')
    setTradeInColor('')
    setTradeInOriginalBox('')
    setTradeInFaceIdWorking('')
    setTradeInPartsReplaced('')
    setTradeInReplacedParts('')
    setTradeInObservations('')
  }

  function handleTradeInChange(checked: boolean) {
    setHasTradeIn(checked)
    if (!checked) resetTradeInDetails()
  }

  function handleTradeInPartsReplacedChange(value: string) {
    setTradeInPartsReplaced(value)
    if (value !== 'Sim') setTradeInReplacedParts('')
  }

  return (
    <section aria-labelledby="category-configurator-title">
      <h2 id="category-configurator-title" className="sr-only">
        Configure sua consulta de {category.title}
      </h2>

      <form
        ref={formRef}
        aria-labelledby="category-configurator-title"
        className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="space-y-4 rounded-[1.75rem] border border-border bg-card/70 p-4 sm:p-7 lg:p-9">
          <fieldset className="rounded-2xl border border-border/70 bg-background/50 p-4 sm:p-6">
            <legend className="px-2">
              <span className="font-display text-lg">01</span>
              <span className="ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {isAssistance ? 'Informe o aparelho' : 'Escolha o produto'}
              </span>
            </legend>

            <label
              htmlFor={usesManualAssistanceModel ? 'assistance-model' : 'category-product'}
              className="mb-2 block text-sm font-medium"
            >
              {isAssistance ? 'Modelo do aparelho' : category.title}
            </label>
            <div className="relative">
              <Smartphone
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              {usesManualAssistanceModel ? (
                <input
                  id="assistance-model"
                  type="text"
                  required
                  maxLength={100}
                  value={assistanceModel}
                  onChange={(event) => setAssistanceModel(event.currentTarget.value)}
                  placeholder="Ex.: iPhone 13 Pro"
                  className={`${FIELD_CLASS_NAME} pl-11`}
                />
              ) : (
                <>
                  <select
                    id="category-product"
                    required
                    value={selectedProductId}
                    onChange={(event) => handleProductChange(event.currentTarget.value)}
                    className={`${FIELD_CLASS_NAME} appearance-none pl-11 pr-11`}
                  >
                    <option value="" disabled>
                      {isAssistance ? 'Selecione o modelo' : 'Selecione uma opção'}
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
            {selectedProduct?.detail && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {selectedProduct.detail}
              </p>
            )}
          </fieldset>

          {selectedProduct && variants.length > 0 && (
            <fieldset className="rounded-2xl border border-border/70 bg-background/50 p-4 sm:p-6">
              <legend className="px-2">
                <span className="font-display text-lg">02</span>
                <span className="ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Escolha {category.variantLabel.toLowerCase()}
                </span>
              </legend>

              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="size-4 text-primary" aria-hidden="true" />
                Selecione a opção desejada
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={variant.stock === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}
                  >
                    <input
                      type="radio"
                      name="category-variant"
                      value={variant.id}
                      required
                      disabled={variant.stock === 0}
                      checked={selectedVariantId === variant.id}
                      onChange={(event) => setSelectedVariantId(event.currentTarget.value)}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-12 flex-col items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-center text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-disabled:opacity-45">
                      <span>{variant.label}</span>
                      {variant.stock === 0 && (
                        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide">
                          Indisponível
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {hasNoActiveVariants && (
            <p
              role="status"
              className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-muted-foreground"
            >
              Este produto está sem opções ativas no momento. Consulte a equipe para verificar
              alternativas.
            </p>
          )}

          {shouldShowProductDetails && (
            <div className="rounded-2xl border border-border/70 bg-background/50 p-4 sm:p-6">
              <label htmlFor="product-details" className="mb-2 block text-sm font-medium">
                {isAssistance
                  ? 'O que aconteceu com o aparelho?'
                  : category.id === 'troque-seu-usado'
                    ? 'Descreva o aparelho para avaliação'
                    : 'Conte o que você procura'}
              </label>
              <textarea
                id="product-details"
                required={requiresProductDetails}
                minLength={requiresProductDetails ? 4 : undefined}
                maxLength={1000}
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.currentTarget.value)}
                placeholder={
                  isAssistance
                    ? category.detail
                    : category.id === 'troque-seu-usado'
                      ? 'Informe modelo, armazenamento, estado de conservação e defeitos conhecidos.'
                      : 'Informe o modelo ou detalhe que não encontrou na lista.'
                }
                className={`${FIELD_CLASS_NAME} resize-y`}
              />
              {isAssistance && !requiresProductDetails && (
                <p className="mt-2 text-xs text-muted-foreground">Opcional</p>
              )}
            </div>
          )}

          {hasSelection && category.allowTradeIn && (
            <fieldset className="rounded-2xl border border-border/70 bg-background/50 p-4 sm:p-6">
              <legend className="px-2">
                <span className="font-display text-lg">03</span>
                <span className="ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Avalie uma troca
                </span>
              </legend>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card/70 p-4 transition-colors hover:border-primary/50">
                <input
                  type="checkbox"
                  checked={hasTradeIn}
                  onChange={(event) => handleTradeInChange(event.currentTarget.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
                <span>
                  <span className="block text-sm font-semibold">Quero dar um aparelho na troca</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Conte um pouco sobre ele para a equipe avaliar.
                  </span>
                </span>
              </label>

              {hasTradeIn && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="trade-in-model" className="mb-2 block text-sm font-medium">
                        Modelo do aparelho
                      </label>
                      <input
                        id="trade-in-model"
                        type="text"
                        required
                        maxLength={80}
                        value={tradeInModel}
                        onChange={(event) => setTradeInModel(event.currentTarget.value)}
                        placeholder="Ex.: iPhone 12"
                        className={FIELD_CLASS_NAME}
                      />
                    </div>
                    <div>
                      <label htmlFor="trade-in-storage" className="mb-2 block text-sm font-medium">
                        Armazenamento
                      </label>
                      <select
                        id="trade-in-storage"
                        required={isIPhone}
                        value={tradeInStorage}
                        onChange={(event) => setTradeInStorage(event.currentTarget.value)}
                        className={FIELD_CLASS_NAME}
                      >
                        <option value="" disabled={isIPhone}>
                          {isIPhone ? 'Selecione o armazenamento' : 'Não sei informar'}
                        </option>
                        <option>8 GB</option>
                        <option>16 GB</option>
                        <option>32 GB</option>
                        <option>64 GB</option>
                        <option>128 GB</option>
                        <option>256 GB</option>
                        <option>512 GB</option>
                        <option>1 TB</option>
                        <option>2 TB</option>
                      </select>
                    </div>
                  </div>

                  {isIPhone && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="trade-in-battery" className="mb-2 block text-sm font-medium">
                            Saúde da bateria
                          </label>
                          <select
                            id="trade-in-battery"
                            required
                            value={tradeInBattery}
                            onChange={(event) => setTradeInBattery(event.currentTarget.value)}
                            className={FIELD_CLASS_NAME}
                          >
                            <option value="" disabled>
                              Selecione a faixa
                            </option>
                            <option>Entre 100% e 90%</option>
                            <option>Entre 90% e 80%</option>
                            <option>Entre 80% e 70%</option>
                            <option>Entre 70% e 60%</option>
                            <option>Entre 60% e 50%</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="trade-in-color" className="mb-2 block text-sm font-medium">
                            Cor
                          </label>
                          <input
                            id="trade-in-color"
                            type="text"
                            required
                            maxLength={60}
                            value={tradeInColor}
                            onChange={(event) => setTradeInColor(event.currentTarget.value)}
                            placeholder="Ex.: preto"
                            className={FIELD_CLASS_NAME}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="trade-in-original-box" className="mb-2 block text-sm font-medium">
                            Possui caixa original?
                          </label>
                          <select
                            id="trade-in-original-box"
                            required
                            value={tradeInOriginalBox}
                            onChange={(event) => setTradeInOriginalBox(event.currentTarget.value)}
                            className={FIELD_CLASS_NAME}
                          >
                            <option value="" disabled>
                              Selecione
                            </option>
                            <option>Sim</option>
                            <option>Não</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="trade-in-face-id" className="mb-2 block text-sm font-medium">
                            Face ID funciona?
                          </label>
                          <select
                            id="trade-in-face-id"
                            required
                            value={tradeInFaceIdWorking}
                            onChange={(event) => setTradeInFaceIdWorking(event.currentTarget.value)}
                            className={FIELD_CLASS_NAME}
                          >
                            <option value="" disabled>
                              Selecione
                            </option>
                            <option>Sim</option>
                            <option>Não</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="trade-in-parts-replaced" className="mb-2 block text-sm font-medium">
                          Alguma peça foi trocada?
                        </label>
                        <select
                          id="trade-in-parts-replaced"
                          required
                          value={tradeInPartsReplaced}
                          onChange={(event) =>
                            handleTradeInPartsReplacedChange(event.currentTarget.value)
                          }
                          className={FIELD_CLASS_NAME}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          <option>Sim</option>
                          <option>Não</option>
                        </select>
                      </div>

                      {tradeInPartsReplaced === 'Sim' && (
                        <div>
                          <label htmlFor="trade-in-replaced-parts" className="mb-2 block text-sm font-medium">
                            Qual peça foi trocada?
                          </label>
                          <input
                            id="trade-in-replaced-parts"
                            type="text"
                            required
                            maxLength={200}
                            value={tradeInReplacedParts}
                            onChange={(event) => setTradeInReplacedParts(event.currentTarget.value)}
                            placeholder="Informe a peça trocada"
                            className={FIELD_CLASS_NAME}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label htmlFor="trade-in-details" className="mb-2 block text-sm font-medium">
                      {isIPhone ? 'Detalhes do aparelho' : 'Estado, características e defeitos'}
                    </label>
                    <textarea
                      id="trade-in-details"
                      required
                      minLength={8}
                      maxLength={1000}
                      rows={4}
                      value={tradeInDetails}
                      onChange={(event) => setTradeInDetails(event.currentTarget.value)}
                      placeholder={
                        isIPhone
                          ? 'Informe marcas de uso, defeitos ou outros detalhes importantes.'
                          : 'Ex.: tela trincada, bateria, marcas de uso ou outros detalhes importantes.'
                      }
                      className={`${FIELD_CLASS_NAME} resize-y`}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      A avaliação final é feita pela equipe após analisar o aparelho.
                    </p>
                  </div>

                  {isIPhone && (
                    <div>
                      <label htmlFor="trade-in-observations" className="mb-2 block text-sm font-medium">
                        Observações adicionais (opcional)
                      </label>
                      <textarea
                        id="trade-in-observations"
                        maxLength={500}
                        rows={3}
                        value={tradeInObservations}
                        onChange={(event) => setTradeInObservations(event.currentTarget.value)}
                        placeholder="Alguma outra informação que a equipe deve saber?"
                        className={`${FIELD_CLASS_NAME} resize-y`}
                      />
                    </div>
                  )}
                </div>
              )}
            </fieldset>
          )}
        </div>

        <aside className="flex flex-col rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-7 lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Sua seleção
              </p>
              <h2 className="font-display text-2xl">Resumo do pedido</h2>
            </div>
          </div>

          <dl className="mt-7 space-y-4 border-y border-border/70 py-5 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">Categoria</dt>
              <dd className="text-right font-semibold">{category.title}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">
                {isAssistance ? 'Modelo' : 'Produto'}
              </dt>
              <dd className="text-right font-semibold">
                {selectedProduct?.name ??
                  (assistanceModel.trim() || 'Aguardando seleção')}
              </dd>
            </div>
            {selectedVariant && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">{category.variantLabel}</dt>
                <dd className="text-right font-semibold">{selectedVariant.label}</dd>
              </div>
            )}
            {!isAssistance && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Valor</dt>
                  <dd className="text-right font-semibold">
                    {selectedVariant?.price !== null && selectedVariant?.price !== undefined
                      ? formatBRL(selectedVariant.price)
                      : 'Consultar'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Disponibilidade</dt>
                  <dd className="text-right font-semibold">
                    {selectedVariant?.stock === 0
                      ? 'Indisponível'
                      : selectedVariant?.stock
                        ? `${selectedVariant.stock} em estoque`
                        : 'Consultar'}
                  </dd>
                </div>
              </>
            )}
            {hasSelection && category.allowTradeIn && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Troca</dt>
                <dd className="text-right font-semibold">
                  {hasTradeIn ? 'Solicitar avaliação' : 'Não'}
                </dd>
              </div>
            )}
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            {isAssistance
              ? 'Nossa equipe vai analisar as informações e orientar os próximos passos.'
              : 'Estoque e valores podem mudar. A equipe confirma as informações antes de concluir o atendimento.'}
          </p>

          <div className="mt-7">
            {canSendInquiry ? (
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (formRef.current && !formRef.current.reportValidity()) {
                    event.preventDefault()
                  }
                }}
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-center text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_color-mix(in_oklch,var(--primary)_35%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <WhatsappIcon className="size-4 text-[#25D366]" />
                <span>{isAssistance ? 'Solicitar assistência pelo WhatsApp' : 'Consultar pelo WhatsApp'}</span>
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-muted px-6 py-4 text-center text-sm font-semibold text-muted-foreground"
              >
                {disabledInquiryLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <Link
            href="/loja"
            className="mt-5 inline-flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar à loja
          </Link>
        </aside>
      </form>
    </section>
  )
}
