import { dbClient } from "../../../configs/sanityConfig";
import StreetDailyReport from "src/interfaces/StreetDailyReport";
import DateRange from "src/interfaces/DateRange";
import Client from "src/interfaces/Client";
import moment from "moment";

const prepareReportObject = (report: StreetDailyReport) => {
  return {
    _type: "streetDailyReport",
    auditStatus: (report.auditStatus && report.auditStatus) || "pending",
    clientsApproached: (report.clientsApproached && report.clientsApproached) || 0,
    clientsRegistered: (report.clientsRegistered && report.clientsRegistered) || [],
    activitiesReport: (report.activitiesReport && report.activitiesReport) || "",
    reportDate: moment(report.reportDate).format("YYYY-MM-DD"),
    scheduledAppointments: (report.scheduledAppointments && report.scheduledAppointments) || 0,

    store: {
      _type: "reference",
      _ref: report.store._id
    },

    reporter: {
      _type: "reference",
      _ref: report.reporter._id
    }
  };
}

export const createDailyReport = async (data: StreetDailyReport) => {

  if (!data.reportDate || !data.reporter)
    throw new Error("Missing required fields");

  const reportObject = prepareReportObject(data);

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
&& auditStatus != "rejected" 
]{
  ...,
  reporter->,
  store->,
  }
  `;

  try {
    return dbClient.fetch(query, {
      streetRef: streetID,
    });
  } catch (e) {
    throw e;
  }
}

export const deleteDailyReport = async (reportID: string) => {
  try {
    return await dbClient.delete(reportID);
  } catch (e) {
    throw e;
  }
}

export const updateDailyReport = async (report: StreetDailyReport) => {
  if (!report._id) throw new Error("Missing required fields");

  const reportObject = prepareReportObject(report);

  try {
    return await dbClient.patch(report._id).set(reportObject).commit();
  } catch (e) {
    throw e;
  }
}

export const getDailyReportByID = async (reportID: string) => {

  const query = `
*[_type=="streetDailyReport" 
&& _id==$reportID
]{
  ...,
  reporter->,
  store->,
  }
  `;

  try {
    return await dbClient.fetch(query, {
      reportID
    })
  } catch (e) {
    throw e;
  }
}