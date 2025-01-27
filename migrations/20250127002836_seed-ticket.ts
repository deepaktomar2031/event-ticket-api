import type { Knex } from 'knex'
import { ticketData } from '../seed'

const tableName: string = 'ticket'

export async function up(knex: Knex): Promise<void> {
  ticketData.forEach(async (ticket) => {
    await knex(tableName).insert(ticket)
  })

  console.log(`Ticket Table Seeded`)
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName).del()

  console.log(`Ticket Table Unseeded`)
}
