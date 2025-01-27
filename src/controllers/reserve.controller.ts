import { Request, Response } from 'express'
import { redisClient, lockSeats, enqueueUser, dequeueUser, getQueueSize } from '@src/services'
import { RequestBodyType, LockSeatsResult } from '@src/types'
import { ExtendedError } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS, MAX_QUEUE_SIZE } from '@src/constant'

export const reserve = async (req: Request, res: Response) => {
  try {
    const { userId, eventId, seatDetails }: RequestBodyType = req.body

    if (!eventId || !seatDetails || !userId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: 'event id, seat details, and user id are required' })
    }

    const queueKey = `queue:${eventId}`
    const queueSize = await getQueueSize(redisClient, queueKey)

    if (queueSize >= MAX_QUEUE_SIZE) {
      await enqueueUser(redisClient, queueKey, userId)
      return res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
        error: 'Queue is full. You are in line. Please wait for your turn.',
      })
    }

    await enqueueUser(redisClient, queueKey, userId)

    try {
      const lockedSeats: LockSeatsResult = await lockSeats(redisClient, req.body)

      await dequeueUser(redisClient, queueKey, userId)

      return res.status(200).json({ lockedSeats })
    } catch (error) {
      await dequeueUser(redisClient, queueKey, userId)
      throw error
    }
  } catch (error: unknown) {
    console.error(`error: ${error}`)

    if (error instanceof ExtendedError) {
      res.status(error.statusCode).send({ error: error.message })
    } else {
      const serverError = new ExtendedError({ ...APPLICATION_ERRORS.SERVER_ERROR })
      res.status(serverError.statusCode).send({ error: serverError.message })
    }
  }
}
