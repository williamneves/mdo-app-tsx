import {
  SanityDefaultObject,
  SanityDefaultReference
} from "./SanityDefaultInterfaces"
import Store from "./Store"

export default interface Goal extends Partial<SanityDefaultObject> {
  inactive?: boolean
  deleted?: boolean
  mainStoreGoal?: boolean
  name: string // Goal name
  description: string // Goal description
  goalRange: {
    dateStart: Date
    dateEnd: Date
  }
  type: "store" | "product" | "group" | "individual"
  typeReference: string
  keyReferencePath: string // Path to the key reference (e.g. "store._ref")
  category:
    | "dateRangeGoals"
    | "monthlyGoals"
    | "weeklyGoals"
    | "dailyGoals"
    | "specialGoals"
  targetValues: {
    value: number
    description: string
  }[]
  targetStores: Partial<Store[]> | SanityDefaultReference[]
}
