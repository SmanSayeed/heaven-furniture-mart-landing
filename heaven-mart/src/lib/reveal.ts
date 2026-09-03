/**
 * THE REVEAL SYSTEM, without ScrollTrigger.
 *
 * Every element that should arrive carries `data-reveal="<pose>"`; the CSS
 * (night.module.css) owns the hidden pose under `[data-wait]` and the
 * transition out of it. This module stamps `data-wait` and removes it once,
 * the first time the element is genuinely inside the viewport.
 *
 * Why an IntersectionObserver and not ScrollTrigger positions: pinned
 * chapters, translated rails and the portal's fixed sheet all move content
 * without moving the document, and a trigger keyed to a document position
 * fired early, late or never for them (the screenshot review: "titles are
 * hidden"). The observer reads the rendered box, so it is right in every
 * one of those cases, and it costs no scroll listener at all.
 *
 * Inversion law: with reduced motion or no JS this never runs, and the
 * server HTML is the finished page.
 */
export function startReveals(scope: ParentNode, skipWithin?: string): () => void {
  const els = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => !skipWithin || !el.closest(skipWithin),
  )
  if (!els.length || !('IntersectionObserver' in window)) return () => {}

  const pending = new Set(els)
  const show = (el: HTMLElement) => {
    delete el.dataset.wait
    pending.delete(el)
    io.unobserve(el)
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) if (en.isIntersecting) show(en.target as HTMLElement)
    },
    /* the bottom 18% of the viewport does not count as "seen": an element
       arrives once the eye can reach it, not the moment its top edge does */
    { rootMargin: '0px 0px -18% 0px', threshold: 0 },
  )
  els.forEach((el) => {
    el.dataset.wait = ''
    io.observe(el)
  })

  /* the one place the margin would lie: at the very bottom of the page
     nothing can ever cross the 82% line, so the end of the scroll reveals
     whatever is left */
  const onScroll = () => {
    if (!pending.size) return
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (window.scrollY >= max - 2) Array.from(pending).forEach(show)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    io.disconnect()
    window.removeEventListener('scroll', onScroll)
    els.forEach((el) => delete el.dataset.wait)
  }
}
