import Link from 'next/link'
import { night, whatsappMessages } from '@/content/copy'
import { Photo } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { WhatsApp, ArrowRight } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { Words } from './Words'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'

/**
 * CHAPTER 2b · SIGNATURE PIECES. "Six we would show you first."
 *
 * The wall above this shows five ROOMS. That answers "what do you make"
 * and leaves a visitor who is ready NOW with nothing to point at (client:
 * "load some best products ... think what is easy for customers to order
 * immediately"). This chapter is six actual objects, large, from Heaven's
 * own photography.
 *
 * THE WHOLE CARD IS THE ACTION. Every piece opens WhatsApp with its own
 * name already in the message, so the shortest path from "I want that" to
 * a conversation is one tap and nothing to describe. It is not a second
 * CTA competing with the page's one: it is the same button, the same
 * thread, said about a specific object.
 *
 * No prices and no cart. Every piece here is built to a room, so a number
 * on a card would misrepresent how the work is actually quoted.
 *
 * Server Component. The layout is the no-JS truth; the motion layer only
 * staggers the arrival.
 */
export function Signature() {
  const sig = night.signature
  return (
    <section
      id="signature"
      className={s.signature}
      data-chapter="signature"
      aria-label={sig.tag}
    >
      <div className={`${s.inner} ${s.sigHead}`} data-reveal="words" data-stagger>
        <span className={s.sigTag}>{sig.tag}</span>
        <Words lines={sig.title} className={s.title} />
        <p className={s.sigLine}>{sig.line}</p>
      </div>

      <div className={`${s.inner} ${s.sigGrid}`} data-sig-grid data-stagger>
        {sig.pieces.map((piece, i) => (
          <article
            key={piece.photo}
            className={s.sigCard}
            data-sig-card
            data-reveal="rise"
            style={{ '--i': i } as React.CSSProperties}
          >
            {/* the photograph IS the link, so the target is the whole card
                rather than a 14 px line of text under it */}
            <a
              className={s.sigLink}
              href={whatsappUrl(whatsappMessages.aboutPiece(piece.name, piece.room))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={s.sigPlate}>
                <Photo
                  name={piece.photo}
                  /* empty on purpose: the link's own text already names the
                     piece and its room, and repeating it in the alt makes a
                     screen reader say both twice inside one link */
                  alt=""
                  sizes="(min-width: 1100px) 33vw, (min-width: 700px) 48vw, 88vw"
                  low={i > 1}
                />
                <CropMarks />
                <span className={s.sigShade} aria-hidden="true" />
              </span>

              <div className={s.sigBody}>
                <span className={s.sigRoom}>{piece.room}</span>
                {/* a real heading: six unnamed <article>s left nothing
                    between this section's h2 and the studio's for heading
                    navigation to land on */}
                <h3 className={s.sigName}>{piece.name}</h3>
                <span className={s.sigSpecs}>
                  {piece.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </span>
                <span className={s.sigAsk}>
                  <WhatsApp />
                  {sig.ask}
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>

      <div className={`${s.inner} ${s.sigFoot}`}>
        <Link className={`${d.pill} ${d.pillGhost}`} href="/collections">
          {sig.all}
          <ArrowRight />
        </Link>
      </div>
    </section>
  )
}
