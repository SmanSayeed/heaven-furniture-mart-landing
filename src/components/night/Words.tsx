import s from './night.module.css'

/**
 * A title (or any line) whose words arrive one after another out of a line
 * mask. Each line is an overflow clip, each word carries `--i`, and the CSS
 * turns that into a stagger: staggerChildren with no library and no
 * per-frame JavaScript. Wrap the parent in `data-reveal="words"` and
 * NightMotion drives it.
 */
export function Words({
  lines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: readonly string[]
  as?: 'h1' | 'h2' | 'p' | 'span'
  className?: string
}) {
  let i = 0
  return (
    <Tag className={className}>
      {lines
        .filter((line) => line.length > 0)
        .map((line, li) => {
          const words = line.split(' ')
          return (
            <span key={li} className={s.line}>
              {words.map((word, wi) => (
                /* the space lives OUTSIDE the inline-block: a trailing space
                   inside one is collapsed away, and "to you." became "toyou." */
                <span key={wi}>
                  <span className={s.w} style={{ '--i': i++ } as React.CSSProperties}>
                    {word}
                  </span>
                  {wi < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          )
        })}
    </Tag>
  )
}
