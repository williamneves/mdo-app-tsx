import { dbClient } from "../../../configs/sanityConfig";
import StreetDailyReport from "src/interfaces/StreetDailyReport";
import DateRange from "src/interfaces/DateRange";
import Client from "src/interfaces/Client";
import moment from "moment";

export const createDailyReport = async (data: StreetDailyReport) => {

  if (!data.reportDate || !data.reporter)
    throw new Error("Missing required fields");

  let reportObject = {
    _type: "streetDailyReport",
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

  try {
    return await dbClient.create(reportObject);
  } catch (err) {
    throw err;
  }
};

export const getClientsByReporter = async (
    reporterID: string,
    reportDate: string
): Promise<Client> => {

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
    phone,
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

export const getAllDailyReports = async () => {
  const query = `
  *[_type == "streetDailyReport"]{
    _id,
    auditStatus,
    clientsApproached,
    clientsRegistered,
    activitiesReport,
    reportDate,
    scheduledAppointments,
    store->,
    reporter->,
  }
  `;

  try {
    return await dbClient.fetch(query);
  } catch (err) {
    throw err;
  }
};

export const changeAuditStatus = async (
    reportID: string,
    status: "approved" | "rejected",
    auditFeedBack: string
): Promise<StreetDailyReport> => {

  const query = `
  *[_type == "streetDailyReport" && _id == "${reportID}"]{
    _id,
    auditStatus,
    clientsApproached,
    clientsRegistered,
    activitiesReport,
    reportDate,
    scheduledAppointments,
    store->,
    reporter->,
  }
  `;

  try {
    const report = await dbClient.fetch(query);
    return await dbClient.patch(report[0]._id).set({ auditStatus: status, auditFeedBack: auditFeedBack }).commit();
  } catch (err) {
    throw err;
  }
};

const getReportsByReferenceAndDateRangeQuery = `
*[_type=="streetDailyReport" 
&& references($storeRef) 
&& reportDate >= $startDate 
&& reportDate <= $endDate
]{
  ...,
  reporter->,
  store->,
  }
  `;

export const getReportsByReferenceAndDateRange = async (
  storeRef: string,
  { startDate, endDate }: DateRange
): Promise<StreetDailyReport[]> => {
  try {
    return dbClient.fetch(getReportsByReferenceAndDateRangeQuery, {
      storeRef: storeRef,
      startDate: startDate,
      endDate: endDate
    });
  } catch (err) {
    throw err;
  }
};

export const getReportsByStreet = async (streetID: string) => {
  const query = `
*[_type=="streetDailyReport" 
&& references($streetRef)
&& auditStatus != "reproved" 
]{
  ...,
  reporter->,
  store->,
  }
  `;

  try {
    return dbClient.fetch(getReportsByReferenceAndDateRangeQuery, {
      streetRef: streetID,
    });
  } catch (e) {
    throw e;
  }
}