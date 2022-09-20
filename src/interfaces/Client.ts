export default interface Client {
  inactive: boolean
  clientNumber: number
  name: string
  phone: string
  email: string
  birthDay: Date
  gender: string
  hearAboutUs: string
  cpf: string
  store: any
  createdBy: any
  address: {
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
  }
}