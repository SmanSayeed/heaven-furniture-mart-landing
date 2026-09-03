# CONCEPT V2 — "THE LIGHT STORY" (working title: Saadman names it)

> Status: PASS 1 APPLIED (2026-09-02) on Saadman's word ("backup made, change
> everything, plan a fast theme and apply"). Palette, type, bulb, blackout,
> torch, arch, rooms, headline, CTA are live in the working tree. The decision
> sheet (Part 2) still refines the words; the skeleton (Part 3) is pass 2.

---

## Part 1 — What the research says (2026-09-02)

### The four competitor submissions, autopsied with Playwright

| Site | Stack | Techniques | Where it loses |
|---|---|---|---|
| heavenfurnituremart.axistro.dev | Next.js + Lenis | smooth scroll, masonry gallery, stacked "SELECTED WORK" cards, decorative serif | FAKE phone number (+880 171 000 0000), no single CTA, full-website nav (blog/services) against the brief, agency-template feel |
| heaven-furniture-landing.onrender.com | Vite React SPA | fade/slide reveals | brief's example headline verbatim, brief's palette verbatim, static brochure |
| heaven-furniture-mart-rho.vercel.app | Next.js | photo-bg hero, Playfair | brief's example headline verbatim, template luxury |
| heavenfurnituremart.vercel.app | React CDN | 15 sections, glassy pills | brief's headline verbatim, TWO competing CTAs (brief violation), 16k px of scroll |

**Zero canvases across all four. Zero 3D. Zero lighting. Zero interaction beyond scroll reveals.**
Three of four use "Furniture, Crafted Around You" — the literal "e.g." line from the brief PDF.
Ours currently does too. Everyone obeyed the same document; everyone converged.

### The gap (what nobody did)
1. **Light as the concept.** Furniture showrooms ARE light. Loadshedding is the most
   Bangladeshi shared experience there is. Nobody touched either.
2. **A headline in their own words.** The brief says "e.g." — it was an example, not a script.
3. **Interaction.** Nothing responds to the visitor on any of the four sites.
4. **The customer's actual job**: getting a quotation easily. All four have at most a
   mailto/WhatsApp link. None help the customer describe what they want.

### Awwwards validation (September 2026)
- Mouse-reveal lighting on dark ground: Hubtown — Site of the Month April 2026 + Developer
  Award ("cursor uncovers geometry detail and lighting").
- Cartier Watches & Wonders: distinct lit "rooms" entered/exited via scroll (GSAP + Lenis).
- Standing inspiration collections: "Light Reveal Cursor Effect", "Mouse pointer spotlight",
  "Dark Mode", "cursor casts light".
- Technique is award-current; the CONTEXT (a Chattogram showroom during loadshedding) is
  untouched. Technique alone = trend-chasing; technique + true local story = a signature.

### What the judges score (brief, last page — verbatim priorities)
1. Luxury, not generic furniture shop (biggest single factor)
2. Brand clear in the first few seconds
3. Great on mobile
4. Pushes toward ONE clear action ("Request a Quote" or "WhatsApp Us")
5. Clean and fast
THE ONE RULE: design for a real customer who has never heard of Heaven — they must
understand the brand within 30 seconds.

---

## Part 2 — SAADMAN'S DECISION SHEET (the human fingerprints)

> These answers CANNOT come from an AI. Fill them in your own words — rough Bangla/Banglish
> is perfect, polish is Claude's job later. Every answer becomes a design decision.

### D1. The memory (becomes the hero's animation script, second by second)
Close your eyes. Current goes at night in Chattogram. Write 4-6 lines of exactly what
happens, in order, with sounds:
- What is the FIRST thing you hear/see the moment it cuts? (fan winding down? IPS beep?
  everyone's "ooooh"? the sudden weight of dark?)
- What light appears first, and who lights it? (phone torch? charger light? candle?
  hurricane lamp? the neighbour's generator kicking in across the street?)
- What does the room look like in THAT light — what do you notice about the furniture?
- The moment current comes BACK — what is the exact feeling/sound?

ANSWER:
> (Saadman writes here)

### D2. The name (one word/phrase, shown on screen as a design element)
The concept needs a name a Bangladeshi feels in the chest. Candidates to react to — or
better, your own: "আলো আসবে" · "কারেন্ট গেলে" · "বাত্তি" · "আলোয় দেখা" · "GENERATOR ON"
· something from your childhood.
Rule: it may appear ONCE, large, as the loadshedding beat's caption. English carries the
rest of the page.

ANSWER:
> (Saadman writes here)

### D3. The headline (NOT the brief's example — your words)
Formula shapes to pick from and fill (write 3, we choose 1 together):
- [What light does] + [to their work]: e.g. shape "Made to be seen in your light."
- [Place-proud]: e.g. shape "Chattogram's rooms, furnished by hand."
- [The bespoke promise, said new]: e.g. shape "Your walls. Your measurements. Our wood."
Do NOT use these examples — they are shapes. Yours will be better because they are yours.

ANSWER 1:
ANSWER 2:
ANSWER 3:

### D4. The palette twist (one degree of freedom)
Brief's palette is "approximate — match the vibe". All four competitors used it literally.
Keep ivory + one dark + brass, but YOU pick the dark's temperature by answering:
what colour is a Chattogram room at night lit by one warm bulb? (blue-black like the dead
TV? brown-black like wood shadow? green-black like the old fan blades?)

ANSWER:
> (Saadman writes here)

### D5. The shot list (collect from their FB/IG/YT — aim for 15-20, light-first)
Hunt SPECIFICALLY for photos where LIGHT is doing something:
- [ ] showroom in the evening, lamps ON
- [ ] window light falling across a sofa/bed
- [ ] close-up: light raking across wood grain / carving / fabric weave
- [ ] the workshop: a craftsman's hands, work light overhead
- [ ] the MD / team, well lit
- [ ] any video clip with a slow pan across a lit room (for the hero, muted, 3-5s loop)
- [ ] the real logo file
Name them honestly (what/where) and drop them in `assets-raw/photos/v2/`.

### D6. Real customer questions (for the quote flow)
Open their FB page inbox-style: read comments/reviews/messages people leave. Write the 5
questions real customers actually ask (price? katha/size? fabric? delivery time? EMI?).
The quote builder's steps will be THESE questions, in their words.

ANSWER:
> (Saadman writes here)

### D7. The one true detail
One real, specific thing about Heaven only someone who looked closely would know — a
carving motif they repeat, the smell of the workshop, how the MD greets customers, the
street the showroom is on at night. (Ask the WhatsApp group if needed — the brief says
"don't guess, ask".) This becomes the page's one-line signature moment.

ANSWER:
> (Saadman writes here)

---

## Part 3 — The concept skeleton (Claude's half, built AROUND the answers)

**"THE LIGHT STORY"** — the page is Heaven's showroom at night. Light is the narrator.

- **S0 HERO — the strike.** Near-black. One warm filament bulb fades in, swinging gently,
  lighting ONE royal piece and the brand name — HEAVEN FURNITURE MART, Agrabad, Chattogram,
  "Designed. Crafted. Customized." — legible in 3 seconds (judge criterion 2). Then D1's
  script plays: the cut (loadshedding beat, D2's word appears in the dark), the return
  (generator/current back), and the room BLOOMS into the full real photograph. One CTA:
  "Request a Quote" (WhatsApp). 3D: the piece under the bulb is the existing royal canapé
  (already built, already fast) — lit theatrically, NOT a plain turntable viewer.
- **The torch.** From S1 on, on pointer devices the cursor is a warm pool of light that
  reveals photo detail (mask/gradient — cheap, compositor-friendly). On touch: the pool
  follows scroll position / taps. Reduced-motion: everything fully lit, static.
- **Rooms, not sections.** Each section is a geometrically shaped "room" — arch doorways
  (furniture motif), golden-ratio panel splits, clip-path walls — and rooms OVERLAP as you
  scroll (next room's doorway slides over the last, Cartier-style), identical choreography
  mobile + desktop, budgeted in dvh.
- **The quote builder (the dynamic part, Saadman's backend).** A short lit corridor of
  choices built from D6's real questions: category → size/space → fabric swatch → name+
  phone → opens WhatsApp with a composed message (works with zero backend) AND posts to
  the backend for the client's records. One CTA everywhere, this is it.
- **Proof stays real**: D5's photos, MD's verbatim quote, the true milestones, D7's detail.

**Stack:** keep Next.js static export + GSAP + Lenis (already tuned, already fast) — the
concept changes, the engine stays. R3F only for the one hero piece. Everything else is
CSS light (radial-gradients, masks, mix-blend) — that is why it will be fast where
award sites are slow. Budgets unchanged: LCP < 2.5s, JS < 300KB gz, 60fps mid-Android.

**3 days:** Day 1 = decision sheet + photo hunt (Saadman) while Claude builds the light
engine + hero on a fresh branch. Day 2 = rooms + quote builder. Day 3 = polish, mobile
verification on real phone, Lighthouse, screen recording.

---

## Rules that survive the redesign (non-negotiable)
- One CTA. Real facts only. Real photos only. Bangla convo / English code.
- Every git action needs Saadman's explicit permission (new branch included).
- No-JS/no-WebGL fallback: fully lit static page with photos and the CTA.
- Mobile first at 390px; verified on Saadman's Android before "done".
