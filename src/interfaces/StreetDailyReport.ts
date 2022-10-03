import User from 'src/interfaces/User';
import Sale from 'src/interfaces/Sale';
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";
import Store from "src/interfaces/Store";

export default interface StreetDailyReport extends SanityDefaultObject {
  inactive: boolean;
  excluded: boolean;
  reporter: User
  auditStatus: "pending" | "approved" | "rejected"
  clientsApproached: number
  clientsRegistered: number
  activitiesReport?: string
  reportDate: Date
  scheduledAppointments: number
  store: Store
}