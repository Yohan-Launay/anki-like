import type { HttpContext } from '@adonisjs/core/http'
import StudyService from '#services/study_service'

export const FAST_STUDY_KEY = 'fastStudy'

export type FastStudy = {
  deckId: number
  cardIds: number[]
}

export function isFastMode(value: unknown) {
  return value === 'fast'
}

export function studyQs(deckId?: number | null, mode?: string | null) {
  const qs: Record<string, string> = {}
  if (deckId) {
    qs.deck = String(deckId)
  }
  if (mode === 'fast') {
    qs.mode = 'fast'
  }
  return qs
}

export function pullFromFastQueue(
  session: HttpContext['session'],
  deckId: number,
  cardId: number
) {
  const current = session.get(FAST_STUDY_KEY) as FastStudy | undefined
  if (!current || current.deckId !== deckId) {
    return
  }

  session.put(FAST_STUDY_KEY, {
    deckId,
    cardIds: current.cardIds.filter((id) => id !== cardId),
  })
}

export async function loadFastQueue(session: HttpContext['session'], deckId: number) {
  const current = session.get(FAST_STUDY_KEY) as FastStudy | undefined
  if (!current || current.deckId !== deckId) {
    return []
  }

  const cards = await StudyService.cardsInOrder(current.cardIds)
  const remainingIds = cards.map((card) => card.id)
  if (remainingIds.length !== current.cardIds.length) {
    session.put(FAST_STUDY_KEY, { deckId, cardIds: remainingIds })
  }

  return cards
}

export async function beginFastQueue(session: HttpContext['session'], deckId: number) {
  const cardIds = await StudyService.randomCardIds(deckId)
  if (cardIds.length === 0) {
    return false
  }

  session.put(FAST_STUDY_KEY, { deckId, cardIds })
  return true
}
