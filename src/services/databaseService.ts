import { type Knex } from 'knex'
import {
  convertKeysToCamelCase,
  convertKeysToUnderscore,
  extractJsonQuery,
  JSONQuery,
} from '@src/utils'
import { getClient as getDbClient } from './../../knexfile'

export class DatabaseService<T> {
  private tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  getClient() {
    return getDbClient()
  }

  getTableName() {
    return this.tableName
  }

  async findEntries(query?: object, trx?: Knex.Transaction): Promise<Array<T>> {
    let select = this.selectFrom(trx)
    select = this.whereQuery(select, query)

    const results = (await select) as Array<T>

    return convertKeysToCamelCase(results)
  }

  async findEntry(query: object, trx?: Knex.Transaction): Promise<T | undefined> {
    const entries: Array<T> = await this.findEntries(query, trx)

    return entries?.[0]
  }

  async insertEntry(values: Partial<T>, trx?: Knex.Transaction): Promise<T> {
    const result: Array<T> = (await this.withClient(trx)
      .table(this.tableName)
      .insert(convertKeysToUnderscore(values), '*')) as Array<T>

    return convertKeysToCamelCase(result[0])
  }

  async insertEntries(values: Array<Partial<T>>, trx?: Knex.Transaction): Promise<Array<T>> {
    const result: Array<T> = (await this.withClient(trx)
      .table(this.tableName)
      .insert(values.map(convertKeysToUnderscore), '*')) as Array<T>

    return convertKeysToCamelCase(result)
  }

  async updateEntry(query: object, values: Partial<T>, trx?: Knex.Transaction): Promise<T> {
    const client = this.withClient(trx)
    const hasUpdatedAt = await client.schema.hasColumn(this.tableName, 'updated_at')
    const updatedValues = hasUpdatedAt ? { updatedAt: new Date(), ...values } : values
    const result: Array<T> = await this.whereQuery(
      client.table(this.tableName).update(convertKeysToUnderscore(updatedValues), '*'),
      query,
    )

    return convertKeysToCamelCase(result[0])
  }

  async withTransaction<U = void>(
    callback: (trx: Knex.Transaction) => Promise<U>,
    parentTrx?: Knex.Transaction,
  ): Promise<U> {
    if (parentTrx) {
      return callback(parentTrx)
    }
    return this.getClient().transaction(callback)
  }

  protected withClient(trx?: Knex.Transaction) {
    return trx ?? this.getClient()
  }

  protected selectFrom(trx?: Knex.Transaction) {
    return this.withClient(trx).select().from(this.tableName)
  }

  protected whereQuery(select: Knex.QueryBuilder, query?: object) {
    const { whereJson, where } = extractJsonQuery(query)
    let s = select.clone()

    if (where) {
      s = s.where(convertKeysToUnderscore(where))
    }

    if (whereJson) {
      s = this.whereJsonQuery(s, whereJson)
    }

    return s
  }

  protected whereJsonQuery(select: Knex.QueryBuilder, query: Record<string, JSONQuery>) {
    return Object.entries(query).reduce(
      (previousValue, [key, value]) => value.toQuery(previousValue, key),
      select.clone(),
    )
  }
}
