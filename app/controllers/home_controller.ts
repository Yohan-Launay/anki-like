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

    const now = StudyService.nowForDb()
    const decks = await Deck.query()
      .where('userId', user.id)
      .withCount('cards')
      .withCount('cards', (query) => {
        query.where('dueAt', '<=', now).as('due_count')
      })
      .orderBy('name', 'asc')

    const stats = await StudyService.stats(user.id)

    return inertia.render('home', {
      decks: DeckTransformer.transform(decks),
      stats,
    })
  }
}
