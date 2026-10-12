import { useEffect, useRef, useState } from 'react'

const CHARS = '!@#$%^&*<>?/\\|~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface Props {
  text: string
  className?: string
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
}

export default function DecryptText({ text, className = '', delay = 0, tag: Tag = 'span' }: Props) {
  const [displayed, setDisplayed] = useState(() =>
    text.replace(/[^\s]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  )
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayed(text)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true)
          setTimeout(() => runScramble(text, setDisplayed), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, delay, triggered])

  return <Tag ref={ref as any} className={className}>{displayed}</Tag>
}

function runScramble(target: string, set: (s: string) => void) {
  const chars = target.split('')
  const total = chars.length
  let frame = 0
  const framesPerChar = 4
  const totalFrames = total * framesPerChar

  const id = setInterval(() => {
    const revealed = Math.floor(frame / framesPerChar)
    set(
      chars
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < revealed) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')
    )
    frame++
    if (frame > totalFrames) {
      set(target)
      clearInterval(id)
    }
  }, 28)
}
