export default interface PaymentMethod {
  inactive: boolean
  title: string
  description: string
  paymentType:
    "creditCard"
    | "debitCard"
    | "cash"
    | "installment"
    | "pix"
    | "ted"
    | "other"
  store: any
  bankAccount: any
}