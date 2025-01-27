export const NODE_ENV = process.env.NODE_ENV!
export const PORT = Number(process.env.PORT!)
export const DATABASE_URL = process.env.DATABASE_URL!
export const REDIS_URL = process.env.REDIS_URL!
export const SEAT_LOCK_EXPIRATION = Number(process.env.SEAT_LOCK_EXPIRATION!)
export const MAX_QUEUE_SIZE = 5000
export const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify'
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!
