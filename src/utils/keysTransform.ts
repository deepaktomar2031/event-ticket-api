/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Knex } from 'knex'
import type { IStringifiable } from '@src/types'

export const underscoreToCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())

export const camelCaseToUnderscore = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()

export const convertKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item))
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {}

    Object.keys(obj).forEach((key) => {
      const value: any = obj[key]

      if (value != null) {
        const newKey = underscoreToCamelCase(key)
        newObj[newKey] = value
      }
    })

    return newObj
  }

  return obj
}

export class JSONQuery implements IStringifiable {
  constructor(readonly query: any) {}

  toString() {
    return JSON.stringify(this.query)
  }

  toQuery(knex: Knex.QueryBuilder, column: string) {
    return knex.whereJsonObject(column, this.query)
  }
}

export const extractJsonQuery = (query: object = {}) => {
  const whereJson: Record<string, JSONQuery> = {}
  const where: Record<string, any> = {}

  Object.entries(query).forEach(([key, value]) => {
    if ((value as any) instanceof JSONQuery) {
      whereJson[key] = value
    } else {
      where[key] = value
    }
  })

  return { whereJson, where }
}

export const convertKeysToUnderscore = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToUnderscore(item))
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {}

    Object.entries(obj).forEach(([key, value]) => {
      if (value != null) {
        const newKey = camelCaseToUnderscore(key)
        newObj[newKey] = value
      }
    })

    return newObj
  } else if (obj !== null && typeof obj === 'string') {
    return camelCaseToUnderscore(obj)
  }

  return obj
}
