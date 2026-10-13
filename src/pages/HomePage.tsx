import Hero from '../components/Hero'
import About from '../components/About'
import Timeline from '../components/Timeline'

interface HomePageProps {
  onJoinClick: () => void
  theme?: 'green' | 'blue'
}

export default function HomePage({ onJoinClick, theme = 'green' }: HomePageProps) {
  return (
    <>
      <Hero onJoinClick={onJoinClick} theme={theme} />



      <About />
      <Timeline />
    </>
  )
}
