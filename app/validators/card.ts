import vine from '@vinejs/vine'
import { RATINGS } from '#services/srs_service'

export const cardValidator = vine.create({
  front: vine.string().trim().minLength(1).maxLength(2000),
  back: vine.string().trim().minLength(1).maxLength(2000),
  explanation: vine.string().trim().maxLength(2000).optional(),
})

export const reviewValidator = vine.create({
  rating: vine.enum(RATINGS),
  deckId: vine.number().positive().optional(),
  mode: vine.enum(['fast']).optional(),
})

export const flagValidator = vine.create({
  deckId: vine.number().positive().optional(),
  mode: vine.enum(['fast']).optional(),
})

export const fastStudyValidator = vine.create({
  deckId: vine.number().positive(),
})
