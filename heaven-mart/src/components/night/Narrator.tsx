import { night } from '@/content/copy'
import { Words } from './Words'
import s from './night.module.css'

/**
 * One line in the second person at the head of every chapter: the story's
 * voice. Small, brass, and the words arrive out of a mask. Seven lines,
 * thirty words, the only new copy on the page.
 */
export function Narrator({ id }: { id: (typeof night.chapters)[number]['id'] }) {
  const ch = night.chapters.find((c) => c.id === id)
  if (!ch) return null
  return (
    <div data-reveal="words" data-narrator>
      <Words as="p" lines={[ch.narrator]} className={s.narr} />
    </div>
  )
}

/** the chapter's number and name, the eyebrow above the narrator */
export function ChapterTag({ id }: { id: (typeof night.chapters)[number]['id'] }) {
  const ch = night.chapters.find((c) => c.id === id)
  if (!ch) return null
  return (
    <span className={s.eyebrow}>
      {ch.no} · {ch.name}
    </span>
  )
}
