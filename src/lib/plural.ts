/**
 * "1 piece" / "12 pieces".
 *
 * WHY A HELPER FOR SOMETHING THIS SMALL. The catalogue is `as const`, so
 * TypeScript knows every category's piece count as a literal type. The
 * moment a batch of photographs landed and no category had exactly one
 * piece left, `cat.pieces.length === 1` became `'3 | 4 | 5 | 17' === 1`,
 * which the compiler correctly refuses as a comparison that can never be
 * true - and it did so in five files at once, none of which were wrong.
 *
 * Widening to `number` here fixes all five and keeps the rule where it
 * belongs: the count is data, and its grammar is a formatting concern.
 */
export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}
