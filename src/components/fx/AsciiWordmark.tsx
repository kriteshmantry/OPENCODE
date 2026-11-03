import { useEffect, useRef } from 'react'

const GLYPHS = '01{}[]<>/\\=+*#$%&;:!?_-~^ABCDEFabcdef'
// Dense glyphs inside the letters so the letterforms stay legible
const DENSE = '#$%&@08BDMNQW{}[]'
const FAINT = '·'

interface Props {
  text: string
  className?: string
}

/**
 * A wordmark rendered as a grid of code characters on canvas. Letter cells
 * shimmer in a slow diagonal wave; the pointer churns and lights cells around
 * it (revealing faint "hidden" code in the empty space too) and a click sends
 * a ripple across the grid.
 */
export default function AsciiWordmark({ text, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let cellW = 9
    let cellH = 14
    let cols = 0
    let rows = 0
    let mask: Uint8Array = new Uint8Array(0)
    let chars: string[] = []
    let width = 0
    let height = 0
    let raf = 0
    let visible = false
    let mouse = { x: -9999, y: -9999 }
    const ripples: { x: number; y: number; t: number }[] = []

    const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]
    const randDense = () => DENSE[(Math.random() * DENSE.length) | 0]

    function build() {
      width = wrap!.clientWidth
      cellW = width < 640 ? 6 : 9
      cellH = Math.round(cellW * 1.55)

      // Size the word to span the width, then sample it onto the character grid
      const probe = document.createElement('canvas').getContext('2d')!
      probe.font = `800 100px 'JetBrains Mono', ui-monospace, monospace`
      const fontSize = (width * 0.98 * 100) / probe.measureText(text).width
      height = Math.ceil(fontSize * 0.86)

      cols = Math.floor(width / cellW)
      rows = Math.floor(height / cellH)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const o = off.getContext('2d')!
      o.fillStyle = '#fff'
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.font = `800 ${fontSize / cellW}px 'JetBrains Mono', ui-monospace, monospace`
      // Glyph cells are taller than wide, so squash vertically to keep letter proportions
      o.setTransform(1, 0, 0, cellW / cellH, 0, 0)
      o.fillText(text, cols / 2, (rows / 2) * (cellH / cellW) + fontSize / cellW * 0.04)
      const data = o.getImageData(0, 0, cols, rows).data
      mask = new Uint8Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0
      chars = Array.from({ length: cols * rows }, (_, i) => (mask[i] ? randDense() : randGlyph()))

      canvas!.width = width * dpr
      canvas!.height = rows * cellH * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${rows * cellH}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(now: number) {
      const styles = getComputedStyle(document.documentElement)
      const primary = styles.getPropertyValue('--primary').trim() || '#00ff41'
      const accent = styles.getPropertyValue('--accent').trim() || '#00d4ff'
      const muted = styles.getPropertyValue('--muted-fg').trim() || '#5a7870'

      ctx!.clearRect(0, 0, width, rows * cellH)
      ctx!.font = `500 ${cellH * 0.82}px 'JetBrains Mono', ui-monospace, monospace`
      ctx!.textBaseline = 'top'
      const t = now / 1000
      const R = width < 640 ? 70 : 130

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = c * cellW
          const y = r * cellH
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const near = d < R ? 1 - d / R : 0

          let ripple = 0
          for (const rp of ripples) {
            const age = t - rp.t
            const front = age * 520
            const rd = Math.abs(Math.hypot(x - rp.x, y - rp.y) - front)
            if (rd < 26) ripple = Math.max(ripple, (1 - rd / 26) * Math.max(0, 1 - age / 1.6))
          }

          if (mask[i]) {
            // Diagonal shimmer wave
            const wave = (Math.sin((c + r * 1.8) * 0.12 - t * 1.6) + 1) / 2
            if (near > 0.15 || ripple > 0.2) chars[i] = randGlyph()
            else if (Math.random() < 0.004) chars[i] = randDense()
            const glow = Math.max(near, ripple)
            // Solid cell behind the glyph carries the letter shape
            ctx!.globalAlpha = 0.1 + wave * 0.08 + glow * 0.25
            ctx!.fillStyle = primary
            ctx!.fillRect(x, y, cellW - 1, cellH - 1)
            ctx!.globalAlpha = 0.55 + wave * 0.3 + glow * 0.4
            ctx!.fillStyle = glow > 0.55 ? '#ffffff' : glow > 0.2 ? accent : primary
            ctx!.fillText(chars[i], x, y)
          } else if (near > 0 || ripple > 0) {
            // Hidden code surfaces in the gaps near the pointer
            if (Math.random() < 0.08) chars[i] = randGlyph()
            ctx!.globalAlpha = Math.max(near * 0.35, ripple * 0.5)
            ctx!.fillStyle = muted
            ctx!.fillText(chars[i], x, y)
          } else if ((c + r) % 3 === 0) {
            ctx!.globalAlpha = 0.08
            ctx!.fillStyle = muted
            ctx!.fillText(FAINT, x, y)
          }
        }
      }
      ctx!.globalAlpha = 1

      while (ripples.length && t - ripples[0].t > 1.6) ripples.shift()
      if (visible && !reduced) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => {
      mouse = { x: -9999, y: -9999 }
    }
    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() / 1000 })
      if (reduced) start()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    const ro = new ResizeObserver(() => {
      build()
      start()
    })

    // Wait for the mono font so the sampled letterforms match the site's type
    document.fonts.ready.then(() => {
      build()
      io.observe(canvas)
      ro.observe(wrap)
      start()
    })

    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onClick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onClick)
    }
  }, [text])

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <canvas ref={canvasRef} className="block cursor-crosshair" role="img" aria-label={text} />
    </div>
  )
}
