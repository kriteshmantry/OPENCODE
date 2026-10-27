interface Props {
  /** Keep the brackets visible instead of only on hover of the parent `.group` */
  locked?: boolean
  /** Use the accent color instead of primary */
  accent?: boolean
}

/**
 * Four L-shaped corners that snap onto the nearest `.group` ancestor on hover,
 * like a targeting reticle locking on. The parent must be `relative`.
 */
export default function CornerBrackets({ locked = false, accent = false }: Props) {
  const cls = `lock-corner${locked ? ' is-locked' : ''}`
  return (
    <span className={accent ? 'lock-accent contents' : 'contents'} aria-hidden="true">
      <span className={`${cls} tl`} />
      <span className={`${cls} tr`} />
      <span className={`${cls} bl`} />
      <span className={`${cls} br`} />
    </span>
  )
}
