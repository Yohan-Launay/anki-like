import vine from '@vinejs/vine'

export const deckValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(80),
  description: vine.string().trim().maxLength(500).nullable().optional(),
  newCardsPerDay: vine.number().min(0).max(50).optional(),
})

export const deckImportFileValidator = vine.create({
  file: vine.file({
    size: '2mb',
    extnames: ['json'],
  }),
})

export const importedDeckValidator = vine.create({
  format: vine.string().optional(),
  version: vine.number().optional(),
  exportedAt: vine.string().optional(),
  deck: vine.object({
    name: vine.string().trim().minLength(1).maxLength(80),
    description: vine.string().trim().maxLength(500).nullable().optional(),
    newCardsPerDay: vine.number().min(0).max(50).optional(),
  }),
  cards: vine
    .array(
      vine.object({
        front: vine.string().trim().minLength(1).maxLength(2000),
        back: vine.string().trim().minLength(1).maxLength(2000),
        explanation: vine.string().trim().maxLength(2000).nullable().optional(),
        dueAt: vine.string().optional(),
        interval: vine.number().min(0).optional(),
        ease: vine.number().min(1.3).max(5).optional(),
        repetitions: vine.number().min(0).optional(),
        lapses: vine.number().min(0).optional(),
      })
    )
    .minLength(1)
    .maxLength(2000),
})
