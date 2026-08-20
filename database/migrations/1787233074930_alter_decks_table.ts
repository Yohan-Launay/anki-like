import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'decks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('new_cards_per_day').notNullable().defaultTo(15)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('new_cards_per_day')
    })
  }
}
