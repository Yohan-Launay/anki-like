import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import { cardValidator, flagValidator } from '#validators/card'
import { pullFromFastQueue, studyQs } from '#services/fast_study'
import CardTransformer from '#transformers/card_transformer'
import DeckTransformer from '#transformers/deck_transformer'
import StudyService from '#services/study_service'
import { DEFAULT_EASE } from '#services/srs_service'

export default class CardsController {
  async store({ auth, params, request, response, session }: HttpContext) {
    const deck = await StudyService.ownedDeck(auth.user!.id, params.id)
    const payload = await request.validateUsing(cardValidator)

    await deck.related('cards').create({
      front: payload.front,
      back: payload.back,
      explanation: payload.explanation || null,
      dueAt: DateTime.utc(),
      interval: 0,
      ease: DEFAULT_EASE,
      repetitions: 0,
      lapses: 0,
    })

    session.flash('success', 'Carte ajoutée')
    return response.redirect().toRoute('decks.show', { id: deck.id })
  }

  async edit({ auth, params, inertia }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)

    return inertia.render('cards/edit', {
      card: CardTransformer.transform(card),
      deck: DeckTransformer.transform(card.deck),
    })
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)
    const payload = await request.validateUsing(cardValidator)

    await card
      .merge({
        front: payload.front,
        back: payload.back,
        explanation: payload.explanation || null,
        flagged: false,
      })
      .save()

    session.flash('success', 'Carte mise à jour')
    return response.redirect().toRoute('decks.show', { id: card.deckId })
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)
    const deckId = card.deckId
    await card.delete()

    session.flash('success', 'Carte supprimée')
    return response.redirect().toRoute('decks.show', { id: deckId })
  }

  async flag({ auth, params, request, response, session }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)
    const { deckId, mode } = await request.validateUsing(flagValidator)

    await card.merge({ flagged: true }).save()
    session.flash('success', 'Carte mise de côté. Corrige-la dans le paquet quand tu veux.')

    if (mode === 'fast' && deckId) {
      pullFromFastQueue(session, deckId, card.id)
    }

    return response.redirect().withQs(studyQs(deckId, mode)).toRoute('study.show')
  }
}
