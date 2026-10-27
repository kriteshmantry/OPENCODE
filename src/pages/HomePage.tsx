import Hero from '../components/Hero'
import About from '../components/About'
import Timeline from '../components/Timeline'

interface HomePageProps {
  onJoinClick: () => void
  theme?: 'green' | 'blue'
  ready?: boolean
}

export default function HomePage({ onJoinClick, theme = 'green', ready = true }: HomePageProps) {
  return (
    <>
      <Hero onJoinClick={onJoinClick} theme={theme} ready={ready} />



      <About />
      <Timeline />
    </>
  )
}
