import { useMutation } from "@tanstack/react-query";
import * as useStreetDailyReport from "./hooks/";

export const useCreateStreetDailyReportQuery = (queryClient: any) => {
  return useMutation((dailyReport: any) => useStreetDailyReport.createDailyReport(dailyReport),
    {
      onSuccess: (newDailyReport) => {
        queryClient.setQueryData(["dailyReports", "all"], (old: any) => {
          if (old) {
            return [...old, newDailyReport];
          }
          return [newDailyReport];
        });
        queryClient.invalidateQueries(["dailyReports", "all"]);
      }
    });
};