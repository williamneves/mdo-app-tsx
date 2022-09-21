export default interface Store {
  _id: string
  inactive?: boolean
  name: string
  taxID: string
  imageURL: string
  address: {
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
  }
}