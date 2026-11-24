const WORDS = ['iPhone', 'Xiaomi', 'POCO', 'Apple Watch', 'MacBook', 'Acessórios', 'Assistência', 'Troca']

export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="overflow-hidden border-y border-primary/40 bg-primary py-4 text-primary-foreground" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10">
        {row.map((word, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl md:text-4xl">
            {word}
            <span className="size-2 rotate-45 bg-primary-foreground" />
          </span>
        ))}
      </div>
    </div>
  )
}
