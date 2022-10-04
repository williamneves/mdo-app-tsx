import { useMutation, useQuery } from "@tanstack/react-query";
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

interface MutationParams {
  reporterID: string;
  reportDate: string;
}

export const useGetClientsByReporterQuery = (queryClient: any) => {
  return useMutation(({ reporterID, reportDate }: MutationParams) => useStreetDailyReport.getClientsByReporter(reporterID, reportDate), {
    onSuccess: (clients) => {
      queryClient.setQueryData(["clients", "byReporter"], (old: any) => {
        if (old) {
          return [...old, clients];
        }
        return [clients];
      });
      queryClient.invalidateQueries(["clients", "byReporter"]);
    }
  });
};