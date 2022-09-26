import { SanityDefaultObject, SanityDefaultReference } from "./SanityDefaultInterfaces"
import Store from "./Store"

export default interface Goal extends Partial<SanityDefaultObject> {
  _id: string
  name: string
  description?: string
  dateStart: Date
  dateEnd: Date
  mainStoreGoal: boolean
  type: "store" | "individual"
  category: "dateRangeGoals" | "monthlyGoals" | "weeklyGoals" | "dailyGoals" | "specialGoals"
  targetField: string
  targetValues: Array<string | number>
  targetStores: Array<Store | SanityDefaultReference>
}