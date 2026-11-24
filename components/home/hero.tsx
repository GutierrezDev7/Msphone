import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { WhatsappIcon } from '@/components/brand-icons'
import { whatsappUrl } from '@/lib/store-config'

export function Hero() {
  return (
    <section className="px-3 pt-20 md:px-5 md:pt-24">
      <div className="relative flex min-h-[min(780px,calc(100svh-5rem))] flex-col justify-end overflow-hidden rounded-[2rem] border border-border/70 bg-background text-foreground md:min-h-[min(820px,calc(100svh-6rem))]">
        <div className="absolute inset-0 lg:left-auto lg:w-[60%]">
          <Image
            src="/images/iphonehero.jpg"
            alt="iPhone azul em um estúdio com iluminação cinematográfica"
            fill
            priority
            sizes="(min-width: 1200px) 900px, 90vw"
            className="object-cover object-[center_30%] animate-in fade-in zoom-in-105 duration-[1600ms]"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/80 lg:to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 flex w-full flex-col gap-7 p-6 pb-10 md:max-w-3xl md:gap-8 md:p-16 lg:max-w-2xl">
        
          <h1 className="max-w-3xl font-display text-balance text-5xl leading-[0.98] md:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            Seu próximo iPhone começa com uma boa escolha.
          </h1>
          <p className="max-w-lg text-pretty text-base leading-relaxed text-foreground/75 md:text-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
            iPhones novos e seminovos, assistência técnica especializada e acessórios. E se o seu
            aparelho ainda tem história, a gente avalia na troca.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-both">
            <Link
              href="/loja"
              className="group flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
            >
              Explorar aparelhos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappUrl('Olá! Vim pelo site da MS PHONE e gostaria de conhecer os aparelhos disponíveis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-full border border-foreground/25 bg-background/35 px-7 py-4 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary hover:bg-primary/10"
            >
              <WhatsappIcon className="size-4 text-[#25D366]" />
              Falar com a equipe
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
