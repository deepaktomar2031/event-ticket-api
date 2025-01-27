import { DatabaseService } from '@src/services'
import { TableName } from '@src/types'
import type { TicketEntry } from '@src/types'

class TicketAdapter extends DatabaseService<TicketEntry> {
  constructor() {
    super(TableName.TICKET)
  }
}

export const ticketAdapter: TicketAdapter = new TicketAdapter()
