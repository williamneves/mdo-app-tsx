export default interface AuthUser {
  _id: string
  inactive?: boolean
  authUID: string
  provider: Array<string>
  name: string
  email: string
  imageURL: string
  imageAsset?: any
  role: 'admin' |
    'manager' |
    'coordinator' |
    'vendor' |
    'streetVendor' |
    'customer'
  stores: [{
    _id: string
    name: string
  }]
  profile?: {
    jobTitle?: string
    birthday?: Date
    gender?: string
    phoneNumbers?: string
    bio?: string
  }
  address?: {
    address?: string
    number?: string
    city?: string
    state?: string
    zipCode?: string
    description?: string
  }
  bankAccount?: {
    cpf: string
    bankName?: string
    accountNumber?: string
    routingNumber?: string
    accountType?: "checking" | "savings"
    chavePix?: string
    tipoChavePix?: "cpf" | "email" | "celular" | "aleatoria"
  }
}