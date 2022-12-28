import { SanityDefaultObject, SanityDefaultReference } from "src/interfaces/SanityDefaultInterfaces";
import Store from "src/interfaces/Store";
import User from "src/interfaces/User";

export default interface ManagerReport extends SanityDefaultObject {
    date: string
    valueInCash: number
    dayDescription: string
    nextDayPlanning: string
    approvedSales: Array<SanityDefaultReference>
    scheduledAppointments: number
    consultationsMade: number
    store: Store
    reporter: User
}