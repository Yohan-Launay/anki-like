import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('deck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('decks')
        .onDelete('CASCADE')
      table.text('front').notNullable()
      table.text('back').notNullable()
      table.timestamp('due_at').notNullable()
      table.integer('interval').notNullable().defaultTo(0)
      table.float('ease').notNullable().defaultTo(2.5)
      table.integer('repetitions').notNullable().defaultTo(0)
      table.integer('lapses').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['deck_id', 'due_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
