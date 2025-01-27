import { Request, Response } from 'express'
import { seatAdapter } from '@src/adapters'
import { redisClient, getLockedSeats } from '@src/services'
import { TicketStatus, SeatEntry, GetLockedSeatsResult } from '@src/types'
import { ExtendedError } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS } from '@src/constant'

export const initialCall = async (req: Request, res: Response) => {
  try {
    const eventId: number = parseInt(req.params.id)

    const seatData: SeatEntry[] = await seatAdapter.findEntries({ eventId })

    const lockedSeats: GetLockedSeatsResult[] = await getLockedSeats(redisClient, eventId)

    const updatedSeatData: SeatEntry[] = seatData.map((seat) => {
      const isLocked = lockedSeats.some(
        (lockedSeat) =>
          lockedSeat.ticketTypeId === seat.ticketTypeId &&
          lockedSeat.rowNumber === seat.rowNumber &&
          lockedSeat.seatNumber === seat.seatNumber,
      )

      if (isLocked) {
        return { ...seat, status: TicketStatus.Reserved }
      }

      return seat
    })

    res.status(STATUS_CODES.OK).json({ seatData: updatedSeatData })
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
