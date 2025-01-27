import { DatabaseService } from '@src/services'
import { TableName } from '@src/types'
import type { EventEntry } from '@src/types'

class EventAdapter extends DatabaseService<EventEntry> {
  constructor() {
    super(TableName.EVENT)
  }
}

export const eventAdapter: EventAdapter = new EventAdapter()
