import { brand, whatsappMessages } from '@/content/copy'

/**
 * The page's single conversion action: a WhatsApp deep link.
 * Always encode with encodeURIComponent; never hand-build query strings.
 */
export function whatsappUrl(message: string = whatsappMessages.default): string {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** CTA link carrying the visitor's chosen fabric (S3 swatches). */
export function whatsappUrlWithSwatch(swatchName: string): string {
  return whatsappUrl(whatsappMessages.withSwatch(swatchName))
}

/** Google Maps directions to the Agrabad showroom. */
export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapsQuery)}`
}
