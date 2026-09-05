import Link from 'next/link'
import { catalogue, night } from '@/content/copy'
import { ArrowRight } from '@/components/ui/Icons'
import { Words } from './Words'
import { Narrator, ChapterTag } from './Narrator'
import { Wall } from './Wall'
import s from './night.module.css'

/**
 * CHAPTER 4 · THE FLOOR. "Walk the floor."
 *
 * The gallery wall (Wall.tsx) on a track. On a wide screen NightMotion pins
 * the chapter and the track travels sideways as the visitor scrolls down
 * (data-rail); the frames turn to face them as they arrive. On a phone the
 * same track is a native scroll-snap carousel: a pinned rail under a thumb
 * fights vertical momentum, and snap is what phones already know.
 */
export function Floor() {
  const f = night.floor
  return (
    <section id="floor" className={s.floor} data-chapter="floor" aria-label="The rooms">
      <div className={`${s.inner} ${s.floorHead}`} data-reveal="words" data-stagger>
        <ChapterTag id="floor" />
        <Words lines={f.title} className={s.title} />
        {/* the narrator and the way out share a row. The chapter is pinned
            to one viewport, so a line of its own here would come straight
            out of the height of the photographs. */}
        <div className={s.floorHeadRow}>
          <Narrator id="floor" />
          <Link className={s.floorAll} href="/collections">
            {f.viewAll}
            <ArrowRight />
          </Link>
        </div>
      </div>

      <Wall mode="rail" />

      <div className={s.railBar} data-rail-bar aria-hidden="true">
        <i />
      </div>
      <div className={s.dots} data-dots aria-hidden="true">
        {catalogue.categories.map((c, i) => (
          <i key={c.slug} {...(i === 0 ? { 'data-on': '' } : {})} />
        ))}
      </div>
      <div className={s.swipe} data-swipe aria-hidden="true">
        {f.swipe} →
      </div>

      {/* the wall's own cursor: a brass ring that follows a mouse across the
          chapter and turns into a disc reading VIEW over a plate. Fine
          pointers only (CSS); NightMotion moves it with transforms. */}
      <div className={s.cursor} data-floor-cursor aria-hidden="true">
        <span className={s.cursorDisc}>
          <span>
            {f.cursor} <ArrowRight />
          </span>
        </span>
      </div>
    </section>
  )
}
