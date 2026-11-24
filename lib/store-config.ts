export const STORE = {
  name: 'MS PHONE',
  whatsappNumber: '5562982750955',
  whatsappDisplay: '+55 (62) 98275-0955',
  instagramHandle: 'msphone__________',
} as const

export const instagramUrl = `https://instagram.com/${STORE.instagramHandle}`

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${STORE.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
