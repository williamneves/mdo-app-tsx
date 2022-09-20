export default interface User {
  inactive: boolean
  authUID: string
  provider: Array<string>
  name: string
  email: string
  imageURL: string
  imageAsset: any
  role: "admin" | "manager" | "coordinator" | "vendor" | "streetVendor" | "client"
  profile: {
    jobTitle: string
    birthDay: Date
    gender: string
    phoneNumber: string
    bio: string
  }
  address: {
    address: string
    number: string
    city: string
    state: string
    zipCode: string
    description: string
  }
  bankAccount: {
    cpf: string
    bankName: string
    accountNumber: string
    routingNumber: string
    accountType: "checking" | "savings"
    chavePix: string
    tipoChavePix: "cpf" | "email" | "celular" | "aleatoria"
  }
}