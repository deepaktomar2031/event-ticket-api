import type { Knex } from 'knex'

const tableName: string = 'seat'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.uuid('id', { primaryKey: true, useBinaryUuid: true }).defaultTo(knex.fn.uuid())

      table.integer('event_id').unsigned().notNullable()
      table.integer('ticket_type_id').unsigned().notNullable()
      table.integer('row_number').notNullable()
      table.integer('seat_number').notNullable()
      table.enum('status', ['available', 'reserved', 'booked'])

      table.foreign('event_id').references('event.event_id')
      table.foreign('ticket_type_id').references('ticket.ticket_type_id')
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
