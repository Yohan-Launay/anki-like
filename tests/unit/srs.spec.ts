import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { applyReview, remainingNewCardSlots } from '#services/srs_service'

test.group('SRS SM-2', () => {
  const now = DateTime.utc(2026, 8, 20, 12)
  const fresh = { interval: 0, ease: 2.5, repetitions: 0, lapses: 0 }

  test('again keeps the card due now so it returns in the same session', ({ assert }) => {
    const result = applyReview(fresh, 'again', now)

    assert.equal(result.repetitions, 0)
    assert.equal(result.lapses, 1)
    assert.equal(result.interval, 0)
    assert.equal(result.dueAt.toISO(), now.toISO())
  })

  test('good on a new card schedules it for tomorrow', ({ assert }) => {
    const result = applyReview(fresh, 'good', now)

    assert.equal(result.repetitions, 1)
    assert.equal(result.interval, 1)
    assert.equal(result.dueAt.toISO(), now.plus({ days: 1 }).toISO())
  })

  test('easy on a new card jumps to 4 days', ({ assert }) => {
    const result = applyReview(fresh, 'easy', now)

    assert.equal(result.interval, 4)
    assert.equal(result.ease, 2.65)
  })

  test('good on a mature card multiplies the interval by ease', ({ assert }) => {
    const result = applyReview({ interval: 10, ease: 2.5, repetitions: 4, lapses: 0 }, 'good', now)

    assert.equal(result.interval, 25)
    assert.equal(result.dueAt.toISO(), now.plus({ days: 25 }).toISO())
  })
})

test.group('New cards daily cap', () => {
  test('finishing a new card does not free a slot the same day', ({ assert }) => {
    assert.equal(remainingNewCardSlots(15, 0), 15)
    assert.equal(remainingNewCardSlots(15, 1), 14)
    assert.equal(remainingNewCardSlots(15, 15), 0)
    assert.equal(remainingNewCardSlots(15, 40), 0)
    assert.equal(remainingNewCardSlots(0, 0), 0)
  })

  test('the same cap keeps a review pile from emptying in one sitting', ({ assert }) => {
    assert.equal(remainingNewCardSlots(15, 0), 15)
    assert.equal(remainingNewCardSlots(15, 15), 0)
    assert.equal(remainingNewCardSlots(15, 62), 0)
  })
})
