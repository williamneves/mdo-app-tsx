import * as reportsQ from "src/queries/streetDailyReport/index";
import { DateRangeOptions, CustomPeriod, createDateRange, GetDateRange } from "src/@utils/createDateRange";


// Hooks
import { useAuth } from "src/hooks/useAuth";

const ReportAnalysis = () => {

  const { selectedStore } = useAuth();

  console.log(selectedStore._id)
  const { data: allReports } = reportsQ.useAllReportsByReferenceAndDateRangeQuery(
    selectedStore ? selectedStore._id : "",
    createDateRange("last3Months").range
    );

  console.log(allReports);

};

export default ReportAnalysis;