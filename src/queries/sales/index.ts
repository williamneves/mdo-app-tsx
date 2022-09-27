import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "./hooks";

// Get SaleNumber
export const useGetSaleNumberQuery = (options?: Object) => {
  return useQuery(["saleNumber", "all"], api.getSaleNumber, {
    // No Stale Time
    staleTime: 0,
    // 1hr cache time
    cacheTime: 1000 * 60 * 60,
    //
    refetchOnWindowFocus: true,
    ...options
  });
};