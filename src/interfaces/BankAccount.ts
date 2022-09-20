export default interface BankAccount {
  inactive: boolean
  bankName: string
  accountNumber: string
  routingNumber: string
  accountType: "checking" | "savings"
  store: any
}