import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import StudyService from '#services/study_service'
import { beginFastQueue, loadFastQueue } from '#services/fast_study'
import { DEFAULT_EASE } from '#services/srs_service'
import type { HttpContext } from '@adonisjs/core/http'

test.group('Fast 10 queue', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('stores 10 random cards so the first one can be shown', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Fast Ten',
      email: `fast10-${Date.now()}@example.test`,
      password: 'password12',
    })
    const deck = await user.related('decks').create({ name: 'Deck', newCardsPerDay: 10 })
    await deck.related('cards').createMany(
      Array.from({ length: 12 }, (_, i) => ({
        front: `Q${i + 1}`,
        back: `A${i + 1}`,
        dueAt: DateTime.utc(),
        interval: 0,
        ease: DEFAULT_EASE,
        repetitions: 0,
        lapses: 0,
        flagged: false,
      }))
    )

    const store: Record<string, unknown> = {}
    const session = {
      get: (key: string) => store[key],
      put: (key: string, value: unknown) => {
        store[key] = value
      },
    } as HttpContext['session']

    const started = await beginFastQueue(session, deck.id)
    assert.isTrue(started)

    const queue = await loadFastQueue(session, deck.id)
    assert.lengthOf(queue, 10)
    assert.isTrue(queue.every((card) => card.deckId === deck.id))
    assert.lengthOf(new Set(queue.map((card) => card.id)), 10)
  })

  test('returns at most 10 ids even when the deck is larger', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Fast Ten',
      email: `fast10-limit-${Date.now()}@example.test`,
      password: 'password12',
    })
    const deck = await user.related('decks').create({ name: 'Deck', newCardsPerDay: 10 })
    await deck.related('cards').createMany(
      Array.from({ length: 3 }, (_, i) => ({
        front: `Q${i + 1}`,
        back: `A${i + 1}`,
        dueAt: DateTime.utc(),
        interval: 0,
        ease: DEFAULT_EASE,
        repetitions: 0,
        lapses: 0,
        flagged: false,
      }))
    )

    const ids = await StudyService.randomCardIds(deck.id)
    assert.lengthOf(ids, 3)
  })
})
