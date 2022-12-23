import {useMutation} from "@tanstack/react-query";
import * as api from "./hooks";
import ManagerReport from "src/interfaces/ManagerReport";

export const useCreateManagerReportQuery = (queryClient: any) => {
    return useMutation((report: ManagerReport) => api.createManagerReport(report),
        {
            onSuccess: (newReport) => {
                queryClient.setQueryData(["managerReports", "all"], (old: any) => {
                    if (old) {
                        return [...old, newReport];
                    }
                    return [newReport];
                });
                queryClient.invalidateQueries(["managerReports", "all"]);
            }
        });
};
