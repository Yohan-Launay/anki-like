import type { HttpContext } from '@adonisjs/core/http'
import CardTransformer from '#transformers/card_transformer'
import StudyService from '#services/study_service'
import { applyReview, isNewCard } from '#services/srs_service'
import { fastStudyValidator, reviewValidator } from '#validators/card'
import {
  beginFastQueue,
  isFastMode,
  loadFastQueue,
  pullFromFastQueue,
  studyQs,
} from '#services/fast_study'
import { DateTime } from 'luxon'

export default class StudyController {
  async show({ auth, request, inertia, session, response }: HttpContext) {
    const deckId = optionalId(request.input('deck'))
    const fast = isFastMode(request.input('mode'))

    if (deckId) {
      await StudyService.ownedDeck(auth.user!.id, deckId)
    }

    if (fast) {
      if (!deckId) {
        return response.redirect().toRoute('home')
      }

      const queue = await loadFastQueue(session, deckId)
      const card = queue[0] ?? null

      return inertia.render('study/show', {
        card: card ? CardTransformer.transform(card) : null,
        remaining: queue.length,
        deckId,
        mode: 'fast' as const,
      })
    }

    const queue = await StudyService.queue(auth.user!.id, deckId)
    const card = queue[0] ?? null

    return inertia.render('study/show', {
      card: card ? CardTransformer.transform(card) : null,
      remaining: queue.length,
      deckId: deckId ?? null,
      mode: null,
    })
  }

  async review({ auth, params, request, response, session }: HttpContext) {
    const card = await StudyService.ownedCard(auth.user!.id, params.id)
    const { rating, deckId, mode } = await request.validateUsing(reviewValidator)
    const result = applyReview(card, rating)
    const firstReviewedAt = card.firstReviewedAt ?? (isNewCard(card) ? DateTime.utc() : null)

    await card
      .merge({
        interval: result.interval,
        ease: result.ease,
        repetitions: result.repetitions,
        lapses: result.lapses,
        dueAt: result.dueAt,
        firstReviewedAt,
        lastReviewedAt: DateTime.utc(),
      })
      .save()

    if (mode === 'fast' && deckId) {
      pullFromFastQueue(session, deckId, card.id)
    }

    return response.redirect().withQs(studyQs(deckId, mode)).toRoute('study.show')
  }

  async startFast({ auth, request, response, session }: HttpContext) {
    const { deckId } = await request.validateUsing(fastStudyValidator)
    await StudyService.ownedDeck(auth.user!.id, deckId)

    const started = await beginFastQueue(session, deckId)
    if (!started) {
      session.flash('error', 'Pas assez de cartes pour un Fast 10.')
      return response.redirect().toRoute('home')
    }

    return response.redirect().withQs(studyQs(deckId, 'fast')).toRoute('study.show')
  }
}

function optionalId(value: unknown) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}
