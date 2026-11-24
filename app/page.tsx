import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { About } from '@/components/home/about'
import { Conditions } from '@/components/home/conditions'
import { Contact } from '@/components/home/contact'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Conditions />
      <Contact />
    </main>
  )
}
