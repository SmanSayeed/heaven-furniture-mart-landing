import { deck } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { Narrator, ChapterTag } from './Narrator'
import s from './night.module.css'

/**
 * CHAPTER 5 · THE MAKER. "The man who builds it."
 *
 * The lights dip once as he arrives (NightMotion's DIM beat), then his
 * portrait - a lit plate in the middle of the chapter - and, beneath it,
 * his own sentence and his name, arriving as the visitor scrolls.
 *
 * NOTHING SITS ON HIS FACE. The words used to run across the portrait,
 * which is unreadable at any contrast ratio and unkind to the man; putting
 * them under it costs one screen of height and settles the question at
 * every width at once. Nothing pins, and nothing is
 * repeated: the milestones live on the studio's founding line, one chapter
 * up, and printing them again here was the same five facts twice. The
 * portrait is the studio JPEG keyed with a mask and a grade until a cut-out
 * PNG lands.
 */
export function Maker() {
  const m = deck.maker
  return (
    <section id="maker" className={s.maker} data-chapter="maker" aria-label={`${m.name}, ${m.role}`}>
      {hasPhoto(m.photo) && (
        <div className={s.makerPlate} data-reveal="rise">
          <Photo
            name={m.photo}
            alt={`${m.name}, ${m.role} of Heaven Furniture Mart.`}
            sizes="(min-width: 861px) 40vw, 78vw"
            className={s.makerPortrait}
            low
          />
        </div>
      )}
      <div className={s.inner}>
        <div className={s.makerText} data-reveal="words" data-stagger>
          <ChapterTag id="maker" />
          <Narrator id="maker" />
          <blockquote className={s.makerQuote} data-reveal="blur" style={{ margin: 0 }}>
            &ldquo;{m.quote}&rdquo;
          </blockquote>
          <p className={s.sub} data-reveal="rise">
            {m.name} · {m.role} · Est. 2020
          </p>
          <p className={s.quiet} data-reveal="rise">
            {m.trust}
          </p>
        </div>
      </div>
    </section>
  )
}
