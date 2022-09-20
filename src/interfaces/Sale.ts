export default interface Sale {
  saleNumber: number
  povNumber: number
  auditStatus: "pending" | "approved" | "rejected"
  canceled: boolean
  excluded: boolean
  date: Date
  client: any
  products: Array<any>
  totalPrice: number
  totalCost: number
  totalDiscount: number
  totalQuantity: number
  saleAmount: number
  profit: number
  markup: number
  score: number
  paymentMethod: any
  splitQuantity: number
  user: any
  store: any
  origin: Array<any>
  schedule: boolean
  scheduleDiscount: boolean
  observations?: string
}