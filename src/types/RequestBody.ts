export type SeatDetails = {
  ticketTypeId: number
  metaData: {
    rowNumbers: number[]
    seatNumbers: number[]
  }
}

export type RequestBodyType = {
  userId: number
  eventId: number
  seatDetails: SeatDetails[]
}
