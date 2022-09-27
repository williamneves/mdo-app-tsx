import User from 'src/interfaces/User';
import Sale from 'src/interfaces/Sale';
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";
import Store from "src/interfaces/Store";

export default interface StreetDailyReport extends SanityDefaultObject {
  street: User
  auditStatus: "pending" | "approved" | "rejected"
  clientsApproached: number
  clientsRegistered: number
  sales: Array<Sale>
  activityReport?: string
  date: Date
  scheduledAppointments: number
  store: Store
}