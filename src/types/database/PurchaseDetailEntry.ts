import { TicketType } from './Enum'

export type PurchaseDetailEntry = {
  id: string
  purchaseId: string
  ticketTypeId: number
  ticketType: TicketType
  rowNumber: number
  seatNumber: number
  amount: number
}
