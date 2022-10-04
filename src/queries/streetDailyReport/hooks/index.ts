import { dbClient } from "../../../configs/sanityConfig";
import StreetDailyReport from "src/interfaces/StreetDailyReport";
import moment from "moment";

export const createDailyReport = async (data: StreetDailyReport) => {
  console.log("data", data);

  if(!data.reportDate || !data.reporter)
    throw new Error("Missing required fields")

  let reportObject = {
    _type: "streetDailyReport",
    // inactive: (data.inactive && data.inactive) || false,
    // excluded: (data.excluded && data.excluded) || false,
    auditStatus: (data.auditStatus && data.auditStatus) || "pending",
    clientsApproached: (data.clientsApproached && data.clientsApproached) || 0,
    clientsRegistered: (data.clientsRegistered && data.clientsRegistered) || [],
    activitiesReport: (data.activitiesReport && data.activitiesReport) || "",
    reportDate: moment(data.reportDate).format("YYYY-MM-DD"),
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
  console.log("reportObject", reportObject);
  try {
    return await dbClient.create(reportObject);
  } catch (err) {
    throw err;
  }
}

export const deleteDayReport = async (id: string) => {
try {
    return await dbClient.delete(id);
  } catch (err) {
    throw err;
  }
};

export const getClientsByReporter = async (reporterID: string, reportDate: string) => {

  console.log("reporterID", reporterID);
  console.log("reportDate", reportDate);

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