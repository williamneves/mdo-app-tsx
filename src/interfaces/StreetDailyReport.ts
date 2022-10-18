import User from 'src/interfaces/User';
import { SanityDefaultObject, SanityDefaultReference } from "src/interfaces/SanityDefaultInterfaces";
import Store from "src/interfaces/Store";

export default interface StreetDailyReport extends SanityDefaultObject {
  inactive: boolean;
  excluded: boolean;
  reporter: User
  auditStatus: "pending" | "approved" | "rejected"
  clientsApproached: number
  clientsRegistered: Array<SanityDefaultReference>
  activitiesReport?: string
  reportDate: Date
  scheduledAppointments: number
  store: Store
}