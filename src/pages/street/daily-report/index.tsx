import StreetDailyReportForm from "components/StreetDailyReportForm";

const CreateDailyReport = () => {

    return (
        <StreetDailyReportForm />
    );
};

CreateDailyReport.acl = {
    action: "read",
    subject: "street-page"
};

export default CreateDailyReport;