import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserResults extends BaseSchema {
  protected tableName = 'user_results'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('level_id').unsigned().notNullable().references('id').inTable('levels').onDelete('CASCADE')
      table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE')
      table.boolean('is_correct').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // table.timestamp('created_at', { useTz: true })
      // table.timestamp('updated_at', { useTz: true })
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
