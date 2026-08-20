import { BaseTransformer } from '@adonisjs/core/transformers'
import type Card from '#models/card'
import { isNewCard } from '#services/srs_service'

export default class CardTransformer extends BaseTransformer<Card> {
  toObject() {
    return {
      id: this.resource.id,
      deckId: this.resource.deckId,
      front: this.resource.front,
      back: this.resource.back,
      explanation: this.resource.explanation,
      dueAt: this.resource.dueAt.toISO()!,
      interval: this.resource.interval,
      ease: this.resource.ease,
      repetitions: this.resource.repetitions,
      lapses: this.resource.lapses,
      isNew: isNewCard(this.resource),
    }
  }
}
