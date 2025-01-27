import { TicketStatus } from './Enum'

export type SeatEntry = {
  id: string
  eventId: number
  ticketTypeId: number
  rowNumber: number
  seatNumber: number
  status: TicketStatus
}

export type GetLockedSeatsResult = {
  ticketTypeId: number
  rowNumber: number
  seatNumber: number
}

export type LockSeatsResult = {
  success: boolean
  lockedSeats: string[]
  unavailableSeats: string[]
}
