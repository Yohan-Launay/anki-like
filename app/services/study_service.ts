import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Card from '#models/card'
import Deck from '#models/deck'
import { FAST_SESSION_SIZE, NEW_CARDS_PER_SESSION, remainingNewCardSlots } from '#services/srs_service'

export default class StudyService {
  static async ownedDeck(userId: number, deckId: number) {
    return Deck.query().where('userId', userId).where('id', deckId).firstOrFail()
  }

  static async ownedCard(userId: number, cardId: number) {
    return Card.query()
      .where('id', cardId)
      .whereHas('deck', (query) => query.where('userId', userId))
      .preload('deck')
      .firstOrFail()
  }

  /**
   * SQLite stores Lucid datetimes as `yyyy-MM-dd HH:mm:ss`.
   * Comparing against ISO strings (`…T…Z`) makes same-day due dates
   * look like they are still due — which is why "Encore" appeared broken.
   */
  static nowForDb() {
    return DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')
  }

  static startOfTodayForDb() {
    return DateTime.utc().startOf('day').toFormat('yyyy-MM-dd HH:mm:ss')
  }

  static summarize(queue: Card[]) {
    const newCount = queue.filter((card) => !card.firstReviewedAt && card.repetitions === 0).length

    return {
      dueCount: queue.length,
      newCount,
      reviewCount: queue.length - newCount,
    }
  }

  static dueCountByDeck(queue: Card[]) {
    const counts = new Map<number, number>()
    for (const card of queue) {
      counts.set(card.deckId, (counts.get(card.deckId) ?? 0) + 1)
    }
    return counts
  }

  static async queue(userId: number, deckId?: number) {
    const now = this.nowForDb()
    const today = this.startOfTodayForDb()
    const decksQuery = Deck.query().where('userId', userId)
    if (deckId) {
      decksQuery.where('id', deckId)
    }
    const decks = await decksQuery
    const deckIds = decks.map((deck) => deck.id)

    if (deckIds.length === 0) {
      return []
    }

    const introducedToday = await this.countByDeckSince(deckIds, 'first_reviewed_at', today)
    const reviewedToday = await this.reviewsDoneTodayByDeck(deckIds, today)

    const reviews: Card[] = []
    const newCards: Card[] = []

    for (const deck of decks) {
      const perDay = deck.newCardsPerDay ?? NEW_CARDS_PER_SESSION
      const reviewBudget = perDay > 0 ? perDay : NEW_CARDS_PER_SESSION
      const reviewLimit = remainingNewCardSlots(reviewBudget, reviewedToday.get(deck.id) ?? 0)
      const newLimit = remainingNewCardSlots(perDay, introducedToday.get(deck.id) ?? 0)

      if (reviewLimit > 0) {
        const dueReviews = await Card.query()
          .where('deckId', deck.id)
          .where('dueAt', '<=', now)
          .where('repetitions', '>', 0)
          .where('flagged', false)
          .orderBy('dueAt', 'asc')
          .limit(reviewLimit)

        reviews.push(...dueReviews)
      }

      if (newLimit > 0) {
        const unseen = await Card.query()
          .where('deckId', deck.id)
          .where('dueAt', '<=', now)
          .where('repetitions', 0)
          .whereNull('firstReviewedAt')
          .where('flagged', false)
          .orderBy('createdAt', 'asc')
          .limit(newLimit)

        newCards.push(...unseen)
      }
    }

    const relearning = await Card.query()
      .whereIn('deckId', deckIds)
      .where('dueAt', '<=', now)
      .where('repetitions', 0)
      .where('lapses', '>', 0)
      .where('firstReviewedAt', '>=', today)
      .where('flagged', false)
      .orderBy('dueAt', 'asc')

    return [...reviews, ...newCards, ...relearning]
  }

  static async stats(userId: number, deckId?: number) {
    return this.summarize(await this.queue(userId, deckId))
  }

  static async randomCardIds(deckId: number, limit = FAST_SESSION_SIZE) {
    const cards = await Card.query().where('deckId', deckId).where('flagged', false).select('id')
    const ids = cards.map((card) => card.id)

    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }

    return ids.slice(0, limit)
  }

  static async cardsInOrder(ids: number[]) {
    if (ids.length === 0) {
      return []
    }

    const cards = await Card.query().whereIn('id', ids).where('flagged', false)
    const byId = new Map(cards.map((card) => [card.id, card]))

    return ids.flatMap((id) => {
      const card = byId.get(id)
      return card ? [card] : []
    })
  }

  private static async countByDeckSince(deckIds: number[], column: string, since: string) {
    const counts = new Map<number, number>()
    const rows = await db
      .from('cards')
      .whereIn('deck_id', deckIds)
      .where(column, '>=', since)
      .groupBy('deck_id')
      .select('deck_id')
      .count('* as total')

    for (const row of rows) {
      counts.set(Number(row.deck_id), Number(row.total ?? 0))
    }

    return counts
  }

  private static async reviewsDoneTodayByDeck(deckIds: number[], today: string) {
    const counts = new Map<number, number>()
    const rows = await db
      .from('cards')
      .whereIn('deck_id', deckIds)
      .where('last_reviewed_at', '>=', today)
      .where((query) => {
        query.whereNull('first_reviewed_at').orWhere('first_reviewed_at', '<', today)
      })
      .groupBy('deck_id')
      .select('deck_id')
      .count('* as total')

    for (const row of rows) {
      counts.set(Number(row.deck_id), Number(row.total ?? 0))
    }

    return counts
  }
}
