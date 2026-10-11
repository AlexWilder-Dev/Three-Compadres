import { Marquee } from '../components/Marquee'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Hero } from './home/Hero'
import { InstaStrip } from './home/InstaStrip'
import { Signatures } from './home/Signatures'
import { Sites } from './home/Sites'
import { Story } from './home/Story'

export function Home() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <Signatures />
      <Marquee />
      <Story />
      <Sites />
      <InstaStrip />
    </>
  )
}
