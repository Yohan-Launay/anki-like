import { BaseTransformer } from '@adonisjs/core/transformers'
import type Deck from '#models/deck'

export default class DeckTransformer extends BaseTransformer<Deck> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      description: this.resource.description,
      newCardsPerDay: this.resource.newCardsPerDay,
      cardsCount: Number(this.resource.$extras.cards_count ?? 0),
      dueCount: Number(this.resource.$extras.due_count ?? 0),
      flaggedCount: Number(this.resource.$extras.flagged_count ?? 0),
    }
  }
}
