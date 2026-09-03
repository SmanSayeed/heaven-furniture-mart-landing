import { night, proof } from '@/content/copy'
import { Words } from './Words'
import { Narrator, ChapterTag } from './Narrator'
import { Points } from './Points'
import s from './night.module.css'

/**
 * CHAPTER 2 · THE STUDIO. "Through the fabric."
 *
 * The first LIGHT chapter: arriving on paper after a dark room is the
 * reveal. What is on the paper changed on the client's call (2026-09-03):
 * a paragraph, a long quotation and three lines of small print became
 * THREE BIG LINES that arrive one at a time, and three points with a drawn
 * mark each, every one of which opens its own sheet of detail. Nothing was
 * cut from what the page says - it was moved behind a button, where the
 * visitor who wants it can read it at a comfortable size.
 *
 * Then the founding line, 2020 -> 2026, drawing itself under a brass dot.
 * Every fact is the brief's. The paper ends on a rule: a hard cut into the
 * dark floor, which after a light chapter is the contrast.
 */
export function Studio() {
  const st = night.studio
  const years = proof.milestones
  return (
    <section id="studio" className={s.studio} data-chapter="studio" aria-label="The studio">
      <div className={s.inner}>
        <div data-reveal="words" data-stagger style={{ display: 'grid', gap: '1rem' }}>
          <ChapterTag id="studio" />
          <Words lines={st.title} className={s.title} />
          <Narrator id="studio" />
        </div>

        {/* the offer, in three sentences. Each arrives on its own. */}
        <div className={s.bigLines} data-stagger>
          {st.lines.map((line) => (
            <div key={line} data-reveal="words">
              <Words lines={[line]} as="p" className={s.bigLine} />
            </div>
          ))}
        </div>

        <Points />

        {/* the founding line: one scrubbed GSAP timeline (NightMotion) */}
        <div className={s.timeline} data-timeline>
          <span className={s.cardKey}>{st.since}</span>
          <svg className={s.timelineSvg} viewBox="0 0 1000 28" preserveAspectRatio="none" aria-hidden="true">
            <path data-tl-line d="M0 14 H1000" />
            {years.map((m, i) => {
              const x = (i / (years.length - 1)) * 1000
              return <path key={m.year} data-tl-tick d={`M${x} 6 V22`} />
            })}
            <circle data-tl-dot className={s.tlDot} cx="1000" cy="14" r="4" />
          </svg>
          <ol className={s.milestones}>
            {years.map((m) => (
              <li key={m.year} data-milestone>
                <b data-year={m.year}>{m.year}</b>
                {m.event}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
