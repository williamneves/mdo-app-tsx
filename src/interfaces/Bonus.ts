import { SanityDefaultObject, SanityDefaultReference } from "./SanityDefaultInterfaces"
import { Moment } from "moment"
import Store from "./Store"
import User from "./User"
import Goal from "./Goal"

export interface IBonusEntries {
  description: string
  type: "bonus" | "discount"
  value: number
}

export interface IBOnusRange {
  dateStart: Date | Moment
  dateEnd: Date | Moment
}

export type TBonusType = "cash" | "points" | "others";

export default interface IBonus extends Partial<SanityDefaultObject> {
  inactive?: boolean
  deleted?: boolean
  name: string
  description: string
  bonusRange: IBOnusRange
  type: TBonusType
  bonusEntries: IBonusEntries[]
  bonusAmount: number
  goal: Partial<Goal> | SanityDefaultReference
  user: Partial<User> | SanityDefaultReference
  store: Partial<Store> | SanityDefaultReference
}
