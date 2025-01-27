import { DatabaseService } from '@src/services'
import { TableName } from '@src/types'
import type { PurchaseDetailEntry } from '@src/types'

class PurchaseDetailAdapter extends DatabaseService<PurchaseDetailEntry> {
  constructor() {
    super(TableName.PURCHASE_DETAIL)
  }
}

export const purchaseDetailAdapter: PurchaseDetailAdapter = new PurchaseDetailAdapter()
