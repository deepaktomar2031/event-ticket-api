import { RedisClientType } from 'redis'
import { RequestBodyType, GetLockedSeatsResult, LockSeatsResult } from '@src/types'
import { SEAT_LOCK_EXPIRATION } from '@src/constant'

export const getLockedSeats = async (
  redisClient: RedisClientType,
  eventId: number,
): Promise<GetLockedSeatsResult[]> => {
  const redisLockedKeys = await redisClient.keys(`seat:${eventId}:*`)
  const lockedSeats = redisLockedKeys.map((key) => {
    const parts = key.split(':') // `seat:eventId:ticketTypeId:rowNumber:seatNumber`
    return {
      ticketTypeId: parseInt(parts[2], 10),
      rowNumber: parseInt(parts[3], 10),
      seatNumber: parseInt(parts[4], 10),
    }
  })
  return lockedSeats
}

export const lockSeats = async (
  redisClient: RedisClientType,
  requestBodyType: RequestBodyType,
): Promise<LockSeatsResult> => {
  const lockedSeats: string[] = []
  const unavailableSeats: string[] = []

  const { eventId, seatDetails }: RequestBodyType = requestBodyType
  for (const detail of seatDetails) {
    const { ticketTypeId } = detail
    const { rowNumbers, seatNumbers } = detail.metaData

    for (let i = 0; i < rowNumbers.length; ++i) {
      const rowNumber = rowNumbers[i]
      const seatNumber = seatNumbers[i]
      const seatKey = `seat:${eventId}:${ticketTypeId}:${rowNumber}:${seatNumber}`
      const lockResult = await redisClient.set(seatKey, JSON.stringify({ eventId, ticketTypeId }), {
        NX: true,
        EX: SEAT_LOCK_EXPIRATION,
      })

      if (lockResult) {
        lockedSeats.push(seatKey)
      } else {
        unavailableSeats.push(seatKey)
      }
    }
  }

  return {
    success: unavailableSeats.length === 0,
    lockedSeats,
    unavailableSeats,
  }
}

export const getQueueSize = async (
  redisClient: RedisClientType,
  queueKey: string,
): Promise<number> => {
  return redisClient.lLen(queueKey)
}

export const enqueueUser = async (
  redisClient: RedisClientType,
  queueKey: string,
  userId: number,
): Promise<number> => {
  return redisClient.rPush(queueKey, userId.toString())
}

export const dequeueUser = async (
  redisClient: RedisClientType,
  queueKey: string,
  userId: number,
): Promise<void> => {
  await redisClient.lRem(queueKey, 1, userId.toString())
}

export const getUserPosition = async (
  redisClient: RedisClientType,
  queueKey: string,
  userId: number,
): Promise<number> => {
  return redisClient.lPos(queueKey, userId.toString())
}

export const processQueueBatch = async (
  redisClient: RedisClientType,
  queueKey: string,
  batchSize: number,
  processFunction: (userIds: string[]) => Promise<void>,
): Promise<void> => {
  const userIds = await redisClient.lRange(queueKey, 0, batchSize - 1)

  if (userIds.length === 0) return

  await redisClient.lTrim(queueKey, userIds.length, -1)
  await processFunction(userIds)
}
