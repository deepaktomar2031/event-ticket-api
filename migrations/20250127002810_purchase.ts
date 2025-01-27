import type { Knex } from 'knex'

const tableName: string = 'purchase'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.uuid('id', { primaryKey: true, useBinaryUuid: true }).defaultTo(knex.fn.uuid())

      table.integer('user_id').unsigned().notNullable()
      table.integer('event_id').unsigned().notNullable()
      table.decimal('total_amount', 10, 2).notNullable()
      table.dateTime('purchased_at').defaultTo(knex.fn.now())

      table.foreign('event_id').references('event.event_id')

      table.unique(['user_id'])
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
