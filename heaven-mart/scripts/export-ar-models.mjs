/**
 * Export the drawn sofa to GLB, one file per fabric, for the AR viewer.
 *
 * WHY A BUILD STEP AND NOT A BLOB.
 * The rest of the page builds its furniture in the browser, so the obvious
 * move was to build it for AR too and hand model-viewer a blob: URL. That
 * breaks Android, which is most of this page's traffic: `ar-modes` falls
 * through to Google's Scene Viewer, and Scene Viewer is a SEPARATE APP that
 * fetches the model over the network. It cannot read a blob: URL belonging to
 * a browser tab. WebXR would have worked; Scene Viewer, the path most Android
 * phones actually take, would have silently failed.
 *
 * So the same generator that draws the hero runs here at build time and
 * writes real, cacheable files. One per swatch, because the visitor picks a
 * fabric on Sheet 03 and then presses "see it in your room" on Sheet 06 — and
 * arriving there to find the sofa back in ivory would undo the one promise
 * this page makes.
 *
 *   npm run ar-models
 *
 * Node's type stripping runs the TypeScript generator directly, so there is
 * exactly one definition of what a Heaven sofa is. If this file and the page
 * ever disagree about the shape of a piece, it is a bug in this comment.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
/* IMPORTED DIRECTLY, not through piece-geometry.ts, and that is load-bearing.
   Node's --experimental-strip-types resolves relative specifiers exactly as
   Node does: the extension is required. piece-geometry.ts imports its royal
   builder as './royal-sofa', which the bundler resolves and Node does not,
   so routing through it fails at import time. royal-sofa.ts has no relative
   imports of its own, so reaching for it directly sidesteps the whole
   question without adding a loader hook or a non-standard tsconfig flag. */
import { buildRoyalSofa } from '../src/components/three/royal-sofa.ts'
import { bespoke } from '../src/content/copy.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'public', 'models')

/* GLTFExporter's GLB path reads its assembled Blob through a FileReader,
   which is a browser API Node does not define. Node DOES define Blob, and
   Blob.arrayBuffer() is the same operation with a promise instead of an
   event, so nine lines restore the one method the exporter calls. Scoped to
   this script; nothing here is shipped to a browser. */
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer
        this.onloadend?.()
      }, (error) => this.onerror?.(error))
    }
  }
}

/** The AR filename for a swatch id. ArViewer.tsx builds the same string; if
    you change it, change it there. */
const fileFor = (id) => `ar-sofa-${id}.glb`

async function main() {
  await mkdir(OUT, { recursive: true })
  const exporter = new GLTFExporter()

  for (const swatch of bespoke.swatches) {
    const piece = buildRoyalSofa(swatch.hex)

    const glb = await new Promise((resolve, reject) => {
      exporter.parse(
        piece,
        (result) => resolve(result),
        (error) => reject(error),
        {
          binary: true,
          /* the piece is authored in metres and stands on y = 0, which is
             exactly what ar-scale="fixed" needs to place it at true size on
             a real floor. No transform is applied here on purpose. */
          onlyVisible: true,
        },
      )
    })

    const name = fileFor(swatch.id)
    await writeFile(join(OUT, name), Buffer.from(glb))
    console.log(`  ${name}  ${(glb.byteLength / 1024).toFixed(0)} KB  ${swatch.name}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
