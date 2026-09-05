/**
 * THE WHOLE-PAGE SWEEP. Run this before believing anything is fixed.
 *
 *   npm run build && npx next start -p 3210
 *   node scripts/qa/sweep.mjs ./shots [url]
 *
 * AGAINST A PRODUCTION BUILD, NEVER THE DEV SERVER. Turbopack's HMR does
 * not tear ScrollTrigger's pins down cleanly, so a dev tab that has been
 * open across a few edits will show pinned sections frozen hundreds of
 * pixels off-screen - black gaps, a floor that never arrives, a 3D stage
 * that is two pixels tall. Every one of those was chased as a real bug at
 * least once. The same commit on `next start` was clean.
 *
 * Three viewports because the faults were viewport-specific: 1356x682 is
 * a short laptop window, 390x844 a phone, 1440x900 the usual desktop.
 *
 * WHAT EACH LINE MEANS
 *   overflow            anything > 0 is a horizontal scrollbar somewhere
 *   chapters            all eight must appear; a missing one is a pin
 *                       measured against the wrong document height
 *   black gap           frames where no chapter covers the middle of the
 *                       screen. 0 on desktop; a phone may show 1-2 at a
 *                       section boundary
 *   wall pinned height  must equal the viewport exactly, or the rooms
 *                       chapter pins with a band of empty ink under it
 *   last plate whole    the fifth room (Bespoke) must be entirely on
 *                       screen WHILE the chapter is still pinned - it used
 *                       to finish arriving after the pin let go
 *   3D at the table     the canvas must mount; "ghosting later" is read
 *                       off the <canvas>, whose parent carries the fade,
 *                       so YES there is not conclusive - check the
 *                       screenshot of the later chapters instead
 */
import { chromium } from 'playwright'
const OUT = process.argv[2] || '.'
const URL = process.argv[3] || 'http://localhost:3210/'
const VPS=[{n:'his',w:1356,h:682,mob:false},{n:'mobile',w:390,h:844,mob:true},{n:'desktop',w:1440,h:900,mob:false}]
for (const v of VPS){
  const browser = await chromium.launch({ args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
  const ctx = await browser.newContext({viewport:{width:v.w,height:v.h},isMobile:v.mob,hasTouch:v.mob,
    userAgent:v.mob?'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Mobile Safari/537.36':undefined})
  const page=await ctx.newPage()
  const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,140)))
  page.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,140))})
  await page.goto(URL,{waitUntil:'networkidle'}); await page.waitForTimeout(2600)
  console.log(`\n===== ${v.n} ${v.w}x${v.h} =====`)
  console.log('  overflow:', await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)+'px')
  let blank=0, chapters=new Set(), wallOk=false, wallH=null, lastIn=false, gl=null, ghost=false, shots={}
  for (let i=0;i<170;i++){
    const s=await page.evaluate(()=>{
      const R=e=>e?e.getBoundingClientRect():null
      const fl=R(document.getElementById('floor'))
      const cards=[...document.querySelectorAll('[data-rcard]')]
      const last=R(cards[cards.length-1])
      const st=R(document.querySelector('[data-stage-bespoke]'))
      const cv=[...document.querySelectorAll('canvas')].find(x=>x.width>320)
      // is anything at all painted in the middle of the screen?
      const mx=innerWidth/2, my=innerHeight/2
      const hit=document.elementFromPoint(mx,my)
      let mid=''
      for (const n of ['room','floor','signature','studio','table','maker','home','ask']){
        const e=document.getElementById(n); if(!e)continue
        const r=e.getBoundingClientRect()
        if (r.top<innerHeight*0.5 && r.bottom>innerHeight*0.5) mid=n
      }
      return { y:Math.round(scrollY), mid, hit: hit?hit.tagName:null,
        floorTop: fl?Math.round(fl.top):null, floorH: fl?Math.round(fl.height):null,
        lastIn: last?(last.left>=-2&&last.right<=innerWidth+2):false,
        stageOn: st?(st.bottom>0&&st.top<innerHeight):false,
        cvOp: cv?parseFloat(getComputedStyle(cv).opacity):0, cvSize: cv?cv.width+'x'+cv.height:null,
        end: Math.round(scrollY+innerHeight)>=document.documentElement.scrollHeight-4 }
    })
    if (!s.mid) blank++
    else chapters.add(s.mid)
    if (s.mid==='floor'){ wallH=s.floorH; if(s.floorTop<=2 && s.lastIn){wallOk=true; lastIn=true; if(!shots.w){await page.screenshot({path:`${OUT}/p-${v.n}-wall-end.png`});shots.w=1}} }
    if (s.stageOn && s.cvSize) gl=s.cvSize
    if (!s.stageOn && s.cvOp>0.05 && (s.mid==='home'||s.mid==='ask')) ghost=true
    if (!shots.s && s.mid==='signature'){await page.screenshot({path:`${OUT}/p-${v.n}-products.png`});shots.s=1}
    if (!shots.t && s.mid==='table'){await page.screenshot({path:`${OUT}/p-${v.n}-table.png`});shots.t=1}
    if (s.end) break
    await page.mouse.wheel(0, Math.round(v.h*0.42)); await page.waitForTimeout(240)
  }
  console.log('  chapters:', [...chapters].join(', '))
  console.log('  frames with NO chapter in the middle of the screen (the black gap):', blank)
  console.log('  wall: pinned height', wallH, '/ viewport', v.h, '| last plate whole while pinned:', lastIn)
  console.log('  3D at the table:', gl ?? 'NOT MOUNTED', '| ghosting later:', ghost?'YES':'no')
  console.log('  errors:', errs.length?errs.slice(0,4):'none')
  await browser.close()
}
