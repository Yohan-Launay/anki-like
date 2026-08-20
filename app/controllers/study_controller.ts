import type { HttpContext } from '@adonisjs/core/http'
import CardTransformer from '#transformers/card_transformer'
import StudyService from '#services/study_service'
import { applyReview } from '#services/srs_service'
import { reviewValidator } from '#validators/card'

export default class StudyController {
  async show({ auth, request, inertia }: HttpContext) {
    const deckId = optionalId(request.input('deck'))
    if (deckId) {
      await StudyService.ownedDeck(auth.user!.id, deckId)
    }

    const queue = await StudyService.queue(auth.user!.id, deckId)
    const card = queue[0] ?? null

    return inertia.render('study/show', {
      card: card ? CardTransformer.transform(card) : null,
      remaining: queue.length,
      deckId: deckId ?? null,
    })
  }

  async review({ auth, params, request, response }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)
    const { rating, deckId } = await request.validateUsing(reviewValidator)
    const result = applyReview(card, rating)

    await card
      .merge({
        interval: result.interval,
        ease: result.ease,
        repetitions: result.repetitions,
        lapses: result.lapses,
        dueAt: result.dueAt,
      })
      .save()

    if (deckId) {
      return response
        .redirect()
        .withQs({ deck: String(deckId) })
        .toRoute('study.show')
    }

    return response.redirect().toRoute('study.show')
  }
}

function optionalId(value: unknown) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}
