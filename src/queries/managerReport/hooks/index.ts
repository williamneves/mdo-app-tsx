import {dbClient} from "../../../configs/sanityConfig";
import moment from "moment";
import ManagerReport from "src/interfaces/ManagerReport";

export const createManagerReport = async (data: ManagerReport) => {
    if (
        !data.date
        || !data.valueInCash
        || !data.scheduledAppointments
        || !data.consultationsMade
        || !data.store._id
        || !data.reporter._id
    ) {
        throw new Error("Missing required fields");
    }

    const reportObject = {
        _type: "managerReport",
        date: moment(data.date).format("YYYY-MM-DD"),
        valueInCash: data.valueInCash,
        dayDescription: data.dayDescription,
        nextDayPlanning: data.nextDayPlanning,
        scheduledAppointments: data.scheduledAppointments,
        consultationsMade: data.consultationsMade,
        approvedSales: data.approvedSales,

        store: {
            _type: "reference",
            _ref: data.store._id
        },

        reporter: {
            _type: "reference",
            _ref: data.reporter._id
        },
    }

    try {
        return await dbClient.create(reportObject);
    } catch (err) {
        throw err;
    }
}