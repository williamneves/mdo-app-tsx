import { dbClient } from "../../../configs/sanityConfig";
import StreetDailyReport from "src/interfaces/StreetDailyReport";

export const createDailyReport = async (data: StreetDailyReport) => {
  console.log("data", data);

  let clientObject = {
    _type: "streetDailyReport",
    inactive: (data.inactive && data.inactive) || false,
    excluded: (data.excluded && data.excluded) || false,
    auditStatus: (data.auditStatus && data.auditStatus) || "pending",
    clientsApproached: (data.clientsApproached && data.clientsApproached) || 0,
    clientsRegistered: (data.clientsRegistered && data.clientsRegistered) || 0,
    activitiesReport: (data.activitiesReport && data.activitiesReport) || "",
    reportDate: (data.reportDate && data.reportDate) || new Date(),
    scheduledAppointments: (data.scheduledAppointments && data.scheduledAppointments) || 0,

    store: {
      // required
      _type: "reference",
      _ref: data.store._id
    },
    reporter: {
      // required
      _type: "reference",
      _ref: data.reporter._id
    }
  };
  try {
    return await dbClient.create(clientObject);
  } catch (err) {
    throw err;
  }
}