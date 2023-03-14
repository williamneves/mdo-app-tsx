import {
  SanityDefaultObject,
  SanityDefaultReference
} from "./SanityDefaultInterfaces"
import { Moment } from "moment"
import Store from "./Store"
import User from "./User"
import Goal from "./Goal"

export interface IBonusEntries {
  type:
    | "sales"
    | "clientsTaken"
    | "appointmentsCreated"
    | "shareBonus"
    | "managerBonus"
    | "others"
    | "healthCare"
    | "generalDiscount"
  description: string
  operation: "add" | "subtract"
  value: number
}

export interface IBOnusRange {
  dateStart: Date | Moment
  dateEnd: Date | Moment
}

export type TBonusPaymentType = "cash" | "points" | "others"

export default interface IBonus extends Partial<SanityDefaultObject> {
  inactive?: boolean
  deleted?: boolean
  status: "draft" | "posted" | "paid" | ""
  name: string
  description: string
  bonusRange: IBOnusRange
  bonusEntries: IBonusEntries[]
  paymentType: TBonusPaymentType
  bonusAmount: number
  goal: Partial<Goal> | SanityDefaultReference
  user: Partial<User> | SanityDefaultReference
  store: Partial<Store> | SanityDefaultReference
}
