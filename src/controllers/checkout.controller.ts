import { Request, Response } from 'express'
import { redisClient, getLockedSeats } from '@src/services'
import { ticketAdapter, seatAdapter, purchaseAdapter, purchaseDetailAdapter } from '@src/adapters'
import { RequestBodyType, TicketType, TicketStatus, PurchaseDetailEntry } from '@src/types'
import { STATUS_CODES, APPLICATION_ERRORS } from '@src/constant'
import { ExtendedError } from '@src/utils'
import { v4 as uuidv4 } from 'uuid'

export const checkout = async (req: Request, res: Response) => {
  try {
    const { userId, eventId, seatDetails }: RequestBodyType = req.body

    const lockedSeats = await getLockedSeats(redisClient, eventId)

    const pipeline = redisClient.multi()
    const purchaseId = uuidv4()
    let totalAmount = 0
    const purchaseDetails: PurchaseDetailEntry[] = []

    await seatAdapter.withTransaction(async (trx) => {
      for (const detail of seatDetails) {
        const { ticketTypeId } = detail
        const { rowNumbers, seatNumbers } = detail.metaData

        for (let i = 0; i < rowNumbers.length; ++i) {
          const rowNumber = rowNumbers[i]
          const seatNumber = seatNumbers[i]
          const seatKey = `seat:${eventId}:${ticketTypeId}:${rowNumber}:${seatNumber}`

          const isLocked = lockedSeats.some(
            (seat) =>
              seat.ticketTypeId === ticketTypeId &&
              seat.rowNumber === rowNumber &&
              seat.seatNumber === seatNumber,
          )

          if (!isLocked) {
            throw new Error(`Seat ${seatKey} is no longer available`)
          }

          await seatAdapter.updateEntry(
            { eventId, ticketTypeId, rowNumber, seatNumber },
            { status: TicketStatus.Booked },
            trx,
          )

          const ticketData = await ticketAdapter.findEntry({ eventId, ticketTypeId }, trx)

          const { price, availableCount } = ticketData

          if (availableCount <= 0) {
            throw new ExtendedError({
              message: `Tickets for ticketTypeId ${ticketTypeId} are sold out.`,
              statusCode: STATUS_CODES.BAD_REQUEST,
            })
          }

          await ticketAdapter.updateEntry(
            { eventId, ticketTypeId },
            { availableCount: availableCount - 1 },
            trx,
          )

          totalAmount += Number(price)

          const ticketType = ticketTypeId === 1 ? TicketType.General : TicketType.VIP

          purchaseDetails.push({
            id: uuidv4(),
            purchaseId,
            ticketTypeId,
            ticketType,
            rowNumber,
            seatNumber,
            amount: price,
          })

          pipeline.del(seatKey)
        }
      }

      await purchaseAdapter.insertEntry(
        {
          id: purchaseId,
          userId,
          eventId,
          totalAmount,
        },
        trx,
      )

      await purchaseDetailAdapter.insertEntries(purchaseDetails, trx)

      await pipeline.exec()
    })

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Seats successfully booked and purchase recorded.',
      purchaseId,
    })
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
