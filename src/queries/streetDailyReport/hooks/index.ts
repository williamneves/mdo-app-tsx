import { dbClient } from "../../../configs/sanityConfig";
import StreetDailyReport from "src/interfaces/StreetDailyReport";

export const createDailyReport = async (data: StreetDailyReport) => {

  const reportObject = {
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
    return await dbClient.create(reportObject);
  } catch (err) {
    throw err;
  }
};

export const getClientsByReporter = async (reporterID: string, reportDate: string) => {

  const query = `
  *[
    _type == "client" 
    && references("${reporterID}")
    && createdAt == "${reportDate}"
    && inactive != true
  ]{
    _id,
    inactive,
    createdAt,
    clientNumber,
    name,
    _createdAt,
  createdBy->
}
  `;

  try {
    return await dbClient.fetch(query);
  } catch (err) {
    throw err;
  }
};