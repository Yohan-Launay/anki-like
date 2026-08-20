import { DateTime } from 'luxon'
import type Deck from '#models/deck'
import type Card from '#models/card'
import { DEFAULT_EASE } from '#services/srs_service'

export const DECK_EXPORT_FORMAT = 'memoire-deck'
export const DECK_EXPORT_VERSION = 1

export type ExportedCard = {
  front: string
  back: string
  explanation: string | null
  dueAt?: string
  interval?: number
  ease?: number
  repetitions?: number
  lapses?: number
}

export type ExportedDeck = {
  format: typeof DECK_EXPORT_FORMAT
  version: typeof DECK_EXPORT_VERSION
  exportedAt: string
  deck: {
    name: string
    description: string | null
    newCardsPerDay: number
  }
  cards: ExportedCard[]
}

export function serializeDeck(deck: Deck, cards: Card[]): ExportedDeck {
  return {
    format: DECK_EXPORT_FORMAT,
    version: DECK_EXPORT_VERSION,
    exportedAt: DateTime.utc().toISO()!,
    deck: {
      name: deck.name,
      description: deck.description,
      newCardsPerDay: deck.newCardsPerDay,
    },
    cards: cards.map((card) => ({
      front: card.front,
      back: card.back,
      explanation: card.explanation,
      dueAt: card.dueAt.toISO() ?? undefined,
      interval: card.interval,
      ease: card.ease,
      repetitions: card.repetitions,
      lapses: card.lapses,
    })),
  }
}

export function filenameForDeck(name: string) {
  const slug =
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60) || 'paquet'

  return `${slug}.json`
}

export function cardCreatePayload(card: ExportedCard) {
  const dueAt = card.dueAt ? DateTime.fromISO(card.dueAt) : DateTime.utc()

  return {
    front: card.front,
    back: card.back,
    explanation: card.explanation || null,
    dueAt: dueAt.isValid ? dueAt : DateTime.utc(),
    interval: card.interval ?? 0,
    ease: card.ease ?? DEFAULT_EASE,
    repetitions: card.repetitions ?? 0,
    lapses: card.lapses ?? 0,
  }
}
