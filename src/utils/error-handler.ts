import { IError } from '@src/types'

// Custom Error classes
export class ExtendedError extends Error {
  public statusCode: number

  constructor({ message, statusCode }: IError) {
    super(message)
    this.statusCode = statusCode || null
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
