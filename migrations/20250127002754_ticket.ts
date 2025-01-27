import type { Knex } from 'knex'

const tableName: string = 'ticket'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.uuid('id', { primaryKey: true, useBinaryUuid: true }).defaultTo(knex.fn.uuid())

      table.integer('event_id').unsigned().notNullable()
      table.integer('ticket_type_id').unsigned().notNullable()
      table.enum('ticket_type', ['general', 'vip']).notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('quantity').notNullable()
      table.integer('available_count').notNullable()

      table.foreign('event_id').references('event.event_id')
      table.unique(['ticket_type_id'])
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
