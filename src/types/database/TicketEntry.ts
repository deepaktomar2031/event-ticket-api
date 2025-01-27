import { TicketType } from './Enum'

export type TicketEntry = {
  id: string
  eventId: string
  ticketTypeId: number
  ticketType: TicketType
  price: number
  quantity: number
  availableCount: number
}
