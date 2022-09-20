export default interface Goal {
  name: string
  description: string
  dateStart: Date
  dateEnd: Date
  type: "store" | "individual"
  category: "dateRangeGoals" | "monthlyGoals" | "weeklyGoals" | "dailyGoals" | "specialGoals"
  targetField: string
  targetValues: Array<string | number>
  targetStores: Array<any>
}