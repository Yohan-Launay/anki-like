import { CardSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Deck from '#models/deck'

export default class Card extends CardSchema {
  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
