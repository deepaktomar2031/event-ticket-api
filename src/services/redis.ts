import { createClient, RedisClientType } from 'redis'
import { REDIS_URL } from '@src/constant'

export const redisClient: RedisClientType = createClient({ url: REDIS_URL })

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err))

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect()
    console.log('Connected to Redis')
  } catch (error) {
    console.error('Error connecting to Redis:', error)
    throw error
  }
}

export default redisClient
