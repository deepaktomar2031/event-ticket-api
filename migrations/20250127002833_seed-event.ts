import type { Knex } from 'knex'
import { eventData } from '../seed'

const tableName: string = 'event'

export async function up(knex: Knex): Promise<void> {
  await knex(tableName).insert(eventData)

  console.log(`Event Table Seeded`)
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName).where({ event_id: 1 }).del()

  console.log(`Event Table Unseeded`)
}
