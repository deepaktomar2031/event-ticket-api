import { DatabaseService } from '@src/services'
import { TableName } from '@src/types'
import type { PurchaseEntry } from '@src/types'

class PurchaseAdapter extends DatabaseService<PurchaseEntry> {
  constructor() {
    super(TableName.PURCHASE)
  }
}

export const purchaseAdapter: PurchaseAdapter = new PurchaseAdapter()
