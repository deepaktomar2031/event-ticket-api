import type { Knex } from 'knex'

const tableName: string = 'purchase_detail'

export async function up(knex: Knex): Promise<void> {
  const exists: boolean = await knex.schema.hasTable(tableName)

  if (!exists) {
    await knex.schema.createTable(tableName, (table: Knex.CreateTableBuilder) => {
      table.uuid('id', { primaryKey: true, useBinaryUuid: true }).defaultTo(knex.fn.uuid())

      table.uuid('purchase_id').unsigned().notNullable()
      table.integer('ticket_type_id').unsigned().notNullable()
      table.enum('ticket_type', ['general', 'vip']).notNullable()
      table.integer('row_number').notNullable()
      table.integer('seat_number').notNullable()
      table.decimal('amount', 10, 2).notNullable()

      table.foreign('purchase_id').references('purchase.id')
    })

    console.log(`${tableName} Table Created`)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName)

  console.log(`${tableName} Table Deleted`)
}
