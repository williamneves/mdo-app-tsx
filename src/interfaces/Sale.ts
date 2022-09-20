import AuthUser from "src/interfaces/authUser";

export default interface Sale {
  _id: string
  saleNumber: number
  PDVNumber: number
  auditStatus: "pending" | "approved" | "rejected"
  canceled: boolean
  excluded: boolean
  date: Date
  client: any
  products: Array<{
    product: any
    price: number
    quantity: number
    discount: number
    cost: number
  }>
  salePayment: Array<{
    paymentMethod: any
    paymentAmount: number
    splitQuantity: number
  }>
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
  user: AuthUser
  store: any
  origin?: Array<any>
  schedule: boolean
  scheduleDiscount: boolean
  observations?: string
}