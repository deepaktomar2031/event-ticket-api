import type { Knex } from 'knex'

const tableName: string = 'event'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.uuid('id', { primaryKey: true, useBinaryUuid: true }).defaultTo(knex.fn.uuid())
      table
        .integer('event_id')
        .unique()
        .notNullable()
        .defaultTo(knex.raw("nextval(pg_get_serial_sequence('event', 'event_id'))"))
      table.string('name', 255).notNullable()
      table.dateTime('date').notNullable()
      table.string('venue', 255).notNullable()
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
