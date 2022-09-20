import {Gender} from '@core/utils/types'

export default interface User {
  _id: string
  name: string
  email: string
  imageURL: string
  imageAsset: any
  role: "admin" | "manager" | "coordinator" | "vendor" | "streetVendor" | "client"
  profile: {
    jobTitle: string
    birthday?: Date
    gender?: Gender
    phoneNumbers?: string
    bio?: string
  }
  createdAt: Date
  updatedAt: Date
}