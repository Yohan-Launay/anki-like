import { DateTime } from 'luxon'
import Card from '#models/card'
import Deck from '#models/deck'
import { isNewCard, NEW_CARDS_PER_SESSION } from '#services/srs_service'

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

  static async queue(userId: number, deckId?: number) {
    const now = this.nowForDb()
    const decksQuery = Deck.query().where('userId', userId)
    if (deckId) {
      decksQuery.where('id', deckId)
    }
    const decks = await decksQuery
    const deckIds = decks.map((deck) => deck.id)

    if (deckIds.length === 0) {
      return []
    }

    const dueCards = () =>
      Card.query().whereIn('deckId', deckIds).where('dueAt', '<=', now)

    const reviews = await dueCards()
      .where('repetitions', '>', 0)
      .orderBy('dueAt', 'asc')

    const newCards: Card[] = []
    for (const deck of decks) {
      const limit = deck.newCardsPerDay ?? NEW_CARDS_PER_SESSION
      if (limit <= 0) {
        continue
      }

      const cards = await Card.query()
        .where('deckId', deck.id)
        .where('dueAt', '<=', now)
        .where('repetitions', 0)
        .where('lapses', 0)
        .orderBy('createdAt', 'asc')
        .limit(limit)

      newCards.push(...cards)
    }

    const relearning = await dueCards()
      .where('repetitions', 0)
      .where('lapses', '>', 0)
      .orderBy('dueAt', 'asc')

    return [...reviews, ...newCards, ...relearning]
  }

  static async stats(userId: number, deckId?: number) {
    const queue = await this.queue(userId, deckId)
    const newCount = queue.filter((card) => isNewCard(card)).length

    return {
      dueCount: queue.length,
      newCount,
      reviewCount: queue.length - newCount,
    }
  }
}
