import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Options extends BaseSchema {
  protected tableName = 'options'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('title').notNullable()
      table.boolean('is_ans').notNullable()
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
