import { z } from 'zod'

export const relationshipTypes = ['new', 'long_term'] as const
export const cities = ['hanoi', 'hcmc'] as const
export const loveLanguageIds = [
  'quality_time',
  'words_of_affirmation',
  'physical_touch',
  'acts_of_service',
  'gifts',
] as const
export const interestIds = [
  'coffee',
  'art',
  'food',
  'nature',
  'music',
  'sports',
  'movies',
  'books',
  'cooking',
  'travel',
] as const

export const relationshipSetupSchema = z.object({
  relationshipType: z.enum(relationshipTypes),
  city: z.enum(cities),
  loveLanguages: z.array(z.enum(loveLanguageIds)).min(1).max(3),
  interests: z.array(z.enum(interestIds)).min(3).max(5),
})

export function toggleLimitedSelection<T extends string>(
  current: readonly T[],
  value: T,
  maximum: number,
): T[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value)
  }

  if (current.length >= maximum) {
    return [...current]
  }

  return [...current, value]
}
