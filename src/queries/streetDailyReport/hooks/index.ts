import { dbClient } from "../../../configs/sanityConfig"
import StreetDailyReport from "src/interfaces/StreetDailyReport"
import moment from "moment"

export const createDailyReport = async (data: StreetDailyReport) => {
  console.log("data", data)

  if (!data.reportDate || !data.reporter)
    throw new Error("Missing required fields")

  let reportObject = {
    _type: "streetDailyReport",
    auditStatus: (data.auditStatus && data.auditStatus) || "pending",
    clientsApproached: (data.clientsApproached && data.clientsApproached) || 0,
    clientsRegistered: (data.clientsRegistered && data.clientsRegistered) || [],
    activitiesReport: (data.activitiesReport && data.activitiesReport) || "",
    reportDate: moment(data.reportDate).format("YYYY-MM-DD"),
    scheduledAppointments:
      (data.scheduledAppointments && data.scheduledAppointments) || 0,

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
  }
  console.log("reportObject", reportObject)
  try {
    return await dbClient.create(reportObject)
  } catch (err) {
    throw err
  }
}

export const getClientsByReporter = async (
  reporterID: string,
  reportDate: string
) => {
  console.log("reporterID", reporterID)
  console.log("reportDate", reportDate)

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
  `

  try {
    return await dbClient.fetch(query)
  } catch (err) {
    throw err
  }
}

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
  `

  try {
    return await dbClient.fetch(query)
  } catch (err) {
    throw err
  }
}

export const changeAuditStatus = async (
  reportID: string,
  status: "approved" | "rejected",
  auditFeedBack: string
) => {
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
  `

  try {
    const report = await dbClient.fetch(query)
    if (report.length > 0) {
      return await dbClient
        .patch(report[0]._id)
        .set({ auditStatus: status, auditFeedBack: auditFeedBack })
        .commit()
    }
  } catch (err) {
    throw err
  }
}
