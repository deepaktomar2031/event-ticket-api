import { DatabaseService } from '@src/services'
import { TableName } from '@src/types'
import type { SeatEntry } from '@src/types'

class SeatAdapter extends DatabaseService<SeatEntry> {
  constructor() {
    super(TableName.SEAT)
  }
}

export const seatAdapter: SeatAdapter = new SeatAdapter()
