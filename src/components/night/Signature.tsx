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
 * A GRID, AND NOTHING MOVES. This was a horizontal rail - pinned, then
 * drifting, then pinned and slowed down - and each version failed the same
 * test: at any moment some pieces were off one edge and some had not
 * arrived (client: "first product image is hidden and customer can never
 * see that - make it normal without any onscroll effect"). A moving strip
 * presents a set; it does not let anybody choose from one.
 *
 * So: every piece on the page at once, two rows of three on a desktop,
 * three rows of two on a phone, and the way out to the full range under
 * them. Nothing to wait for and nothing to chase.
 *
 * Server Component, and now the server HTML is the whole chapter: there is
 * no motion layer behind this at all.
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

      {/* THE GRID. Six pieces, all of them visible, none of them moving. */}
      <div className={`${s.inner} ${s.sigGrid}`} data-stagger>
        {sig.pieces.map((piece, i) => (
          <article
            key={piece.photo}
            className={s.sigCard}
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

      {/* the way out to everything else. A route, not a second CTA: the
          page's one action is still the WhatsApp thread on every card
          above it. */}
      <div className={`${s.inner} ${s.sigFoot}`}>
        <Link className={`${d.pill} ${d.pillGhost}`} href="/collections">
          {sig.all}
          <ArrowRight />
        </Link>
      </div>
    </section>
  )
}
