import type { HttpContext } from '@adonisjs/core/http'
import Deck from '#models/deck'
import DeckTransformer from '#transformers/deck_transformer'
import StudyService from '#services/study_service'

export default class HomeController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user
    if (!user) {
      return inertia.render('home', {})
    }

    const decks = await Deck.query()
      .where('userId', user.id)
      .withCount('cards')
      .withCount('cards', (query) => {
        query.where('flagged', true).as('flagged_count')
      })
      .orderBy('name', 'asc')
    const queue = await StudyService.queue(user.id)
    const dueByDeck = StudyService.dueCountByDeck(queue)

    for (const deck of decks) {
      deck.$extras.due_count = dueByDeck.get(deck.id) ?? 0
    }

    return inertia.render('home', {
      decks: DeckTransformer.transform(decks),
      stats: StudyService.summarize(queue),
    })
  }
}
