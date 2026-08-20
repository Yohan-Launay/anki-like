import { DateTime } from 'luxon'

export const RATINGS = ['again', 'hard', 'good', 'easy'] as const
export type Rating = (typeof RATINGS)[number]

export const DEFAULT_EASE = 2.5
export const MIN_EASE = 1.3
export const NEW_CARDS_PER_SESSION = 15
export const CARDS_PER_PAGE = 20

type SrsFields = {
  interval: number
  ease: number
  repetitions: number
  lapses: number
}

export type SrsResult = SrsFields & {
  dueAt: DateTime
}

/**
 * Simplified SM-2: failed cards stay due and return at the end
 * of the current session. Successful ones are scheduled in days.
 */
export function applyReview(card: SrsFields, rating: Rating, now = DateTime.utc()): SrsResult {
  if (rating === 'again') {
    return {
      interval: 0,
      ease: Math.max(MIN_EASE, roundEase(card.ease - 0.2)),
      repetitions: 0,
      lapses: card.lapses + 1,
      dueAt: now,
    }
  }

  if (rating === 'hard') {
    const interval = card.repetitions === 0 ? 1 : Math.max(1, Math.round(card.interval * 1.2))
    return {
      interval,
      ease: Math.max(MIN_EASE, roundEase(card.ease - 0.15)),
      repetitions: card.repetitions + 1,
      lapses: card.lapses,
      dueAt: now.plus({ days: interval }),
    }
  }

  if (rating === 'good') {
    let interval = 1
    if (card.repetitions === 1) {
      interval = 6
    } else if (card.repetitions > 1) {
      interval = Math.max(1, Math.round(card.interval * card.ease))
    }

    return {
      interval,
      ease: card.ease,
      repetitions: card.repetitions + 1,
      lapses: card.lapses,
      dueAt: now.plus({ days: interval }),
    }
  }

  const interval =
    card.repetitions === 0 ? 4 : Math.max(1, Math.round(card.interval * card.ease * 1.3))

  return {
    interval,
    ease: roundEase(card.ease + 0.15),
    repetitions: card.repetitions + 1,
    lapses: card.lapses,
    dueAt: now.plus({ days: interval }),
  }
}

export function isNewCard(card: Pick<SrsFields, 'repetitions' | 'lapses'>) {
  return card.repetitions === 0 && card.lapses === 0
}

function roundEase(value: number) {
  return Math.round(value * 100) / 100
}
