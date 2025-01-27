import type { Knex } from "knex";
import { generalSeatData, vipSeatData } from "../seed";

const tableName: string = "seat";

export async function up(knex: Knex): Promise<void> {
    generalSeatData.forEach(async (seat) => {
        await knex(tableName).insert(seat);
    });

    vipSeatData.forEach(async (seat) => {
        await knex(tableName).insert(seat);
    });

    console.log(`Seat Table Seeded`);
}

export async function down(knex: Knex): Promise<void> {
    await knex(tableName).del();

    console.log(`Seat Table Unseeded`);
}
