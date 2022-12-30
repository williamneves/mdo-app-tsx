import { useMutation, useQuery } from "@tanstack/react-query";
import * as useStreetDailyReport from "./hooks/";
import StreetDailyReport from "interfaces/StreetDailyReport";
import DateRange from "src/interfaces/DateRange";

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

export const useGetAllDailyReportsQuery = (options?: Object) => {
  return useQuery(["dailyReports", "all"], useStreetDailyReport.getAllDailyReports, {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,
  });
};

interface ChangeAuditStatusParams {
  reportID: string;
  status: "approved" | "rejected";
  auditFeedBack: string;
}

export const useChangeAuditStatusQuery = (queryClient: any) => {
  return useMutation(({ reportID, status, auditFeedBack }: ChangeAuditStatusParams) => useStreetDailyReport.changeAuditStatus(reportID, status, auditFeedBack),
    {
      onSuccess: (updatedDailyReport) => {
        queryClient.setQueryData(["dailyReports", "all"], (old: any) => {
          if (old) {
            return old.map((dailyReport: any) => {
              if (dailyReport._id === updatedDailyReport?._id) {
                return updatedDailyReport;
              }
              return dailyReport;
            });
          }
          return [updatedDailyReport];
        });
        queryClient.invalidateQueries(["dailyReports", "all"]);
      }
    });
};

export const useAllReportsByReferenceAndDateRangeQuery = (storeRef: string, dateRange: DateRange, options?: Object) => {
  return useQuery(["dailyReports", storeRef, dateRange],
    () => useStreetDailyReport.getReportsByReferenceAndDateRange(storeRef, dateRange),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      placeholderData: [],
      enabled: !!storeRef && !!dateRange,
      ...options
    });
}

export const useGetReportByStreetQuery = (streetID: string, options?: Object) => {
  return useQuery(["dailyReports", "street"],
      () => useStreetDailyReport.getReportsByStreet(streetID),
      {
        // 1hr stale time
        staleTime: 1000 * 60 * 60,
        // 12hr cache time
        cacheTime: 1000 * 60 * 60 * 12,
        ...options
      });
}

export const useDeleteDailyReportQuery = (queryClient: any) => {
    return useMutation((reportID: string) => useStreetDailyReport.deleteDailyReport(reportID),
        {
            onSuccess: (newDailyReport) => {
                queryClient.setQueryData(["dailyReports", "street"], (old: any) => {
                    if (old) {
                        return [...old, newDailyReport];
                    }
                    return [newDailyReport];
                });
                queryClient.invalidateQueries(["dailyReports", "street"]);
            }
        });
}

export const useUpdateDailyReportQuery = (queryClient: any) => {
    return useMutation((report: StreetDailyReport) => useStreetDailyReport.updateDailyReport(report),
        {
            onSuccess: (newDailyReport) => {
                queryClient.setQueryData(["dailyReports", "street"], (old: any) => {
                    if (old) {
                        return [...old, newDailyReport];
                    }
                    return [newDailyReport];
                });
                queryClient.invalidateQueries(["dailyReports", "street"]);
            }
        });
}

export const useGetDailyReportByIDQuery = (reportID: string, options?: Object) => {
    return useQuery(["dailyReports", "reportID"],
        () => useStreetDailyReport.getDailyReportByID(reportID),
        {
            // 1hr stale time
            staleTime: 1000 * 60 * 60,
            // 12hr cache time
            cacheTime: 1000 * 60 * 60 * 12,
            ...options
        });
}