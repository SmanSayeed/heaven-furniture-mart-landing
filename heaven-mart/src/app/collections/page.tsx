import type { Metadata } from 'next'
import { RoomsIndex } from '@/components/night/Room'

export const metadata: Metadata = {
  title: 'Collections · Heaven Furniture Mart',
  description:
    'Living room, bedroom, dining, office and bespoke furniture by Heaven Furniture Mart, Agrabad, Chattogram. Every piece built to your measurements.',
  alternates: { canonical: '/collections' },
}

/**
 * /collections — the five rooms as the gallery wall, full width, in the
 * night system. No 3D, no motion script: the frames print in on the page's
 * own first paint and every one is a real Heaven photograph.
 */
export default function CollectionsIndex() {
  return <RoomsIndex />
}
