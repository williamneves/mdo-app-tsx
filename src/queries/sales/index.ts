import { reference } from "@popperjs/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "./hooks";
import Sale from "src/interfaces/Sale";

// Get SaleNumber
export const useGetSaleNumberQuery = (options?: Object) => {
  return useQuery(["saleNumber", "all"],
    api.getSaleNumber,
    {
      // No Stale Time
      staleTime: 0,
      // 1hr cache time
      cacheTime: 0,
      //
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      ...options
    });
};

// Get All Products By Reference (Store)
export const useAllProductsByReferenceQuery = (storeRef: string, options?: Object) => {
  return useQuery(["products", storeRef],
    () => api.getAllProductsByReference(storeRef),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      refetchOnWindowFocus: true,
      ...options
    });
};

// Get All PaymentMethod By Reference (Store)
export const useAllPaymentMethodsByReferenceQuery = (storeRef: string, options?: Object) => {
  return useQuery(["paymentMethods", storeRef],
    () => api.getAllPaymentMethodByReference(storeRef),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      refetchOnWindowFocus: true,
      ...options
    });
};

// Get All Origin
export const useAllOriginQuery = (options?: Object) => {
  return useQuery(["origin", "all"],
    api.getAllOrigin,
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      refetchOnWindowFocus: true,
      ...options
    });
};

// Create New Sale
export const useCreateSaleMutation = (queryClient: any) => {
  return useMutation((sale: any) => api.createSale(sale),
    {
      onSuccess: (newSale) => {
        const salesReferenceList = queryClient.getQueryData(["sales", newSale?.store?._id]);
        if (salesReferenceList) {
          queryClient.setQueryData(["sales", newSale?.store?._id], (old: any) => {
            return [...old, newSale];
          });

          queryClient.invalidateQueries(["sales", newSale?.store?._id]);
        }

        const salesList = queryClient.getQueryData(["sales", "all"]);
        if (salesList) {
          queryClient.setQueryData(["sales", "all"], (old: any) => {
            return [...old, newSale];
          });

          queryClient.invalidateQueries(["sales", "all"]);
        }
      }
    });
};

// Update Entire Sale
export const useUpdateEntireSaleMutation = (queryClient: any) => {
  return useMutation((sale: any) => api.updateEntireSale(sale),
    {
      onSuccess: (updatedSale) => {
        const salesReferenceList = queryClient.getQueryData(["sales", updatedSale?.store?._id]);
        if (salesReferenceList) {
          queryClient.setQueryData(["sales", updatedSale?.store?._id], (old: any) => {
            return old.map((sale: Sale) => {
              if (sale._id === updatedSale._id) {
                return updatedSale;
              }
              return sale;
            });
          });

          queryClient.invalidateQueries(["sales", updatedSale?.store?._id]);
        }

        const salesList = queryClient.getQueryData(["sales", "all"]);
        if (salesList) {
          queryClient.setQueryData(["sales", "all"], (old: any) => {
            return old.map((sale: Sale) => {
              if (sale._id === updatedSale._id) {
                return updatedSale;
              }
              return sale;
            });
          });

          queryClient.invalidateQueries(["sales", "all"]);
        }
      }
    });
}

// Get One Sale By ID
export const useGetSaleByIDQuery = (saleID: string, options?: Object) => {
  return useQuery(["sale", saleID],
    () => api.getOneSaleById(saleID),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      ...options
    });
};

interface dateRange {
  startDate: string,
  endDate: string
}

// Get All Sales By Reference (Store) and Date Range
export const useAllSalesByReferenceAndDateRangeQuery = (storeRef: string, dateRange: dateRange, options?: Object) => {
  return useQuery(["sales", storeRef, dateRange],
    () => api.getSalesByReferenceByDateRange(storeRef, dateRange),
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

// Get Pending Sales
export const usePendingSalesQuery = (referenceID: string, options?: Object) => {
  return useQuery(["sales", "all"],
    () => api.getPendingSales(referenceID),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 12hr cache time
      cacheTime: 1000 * 60 * 60 * 12,
      //
      refetchOnWindowFocus: true,
      ...options
    });
};

// Change sale audit status
interface ChangeSaleAuditStatusParams {
  saleID: string;
  status: "approved" | "rejected";
  auditFeedBack: string;
}

export const useChangeSaleAuditStatusQuery = (queryClient: any) => {
  return useMutation(({ saleID, status, auditFeedBack }: ChangeSaleAuditStatusParams) => api.changeSaleAuditStatus(saleID, status, auditFeedBack),
    {
      onSuccess: (updatedSale) => {
        queryClient.setQueryData(["sales", "all"], (old: any) => {
          if (old) {
            return old.map((dailyReport: any) => {
              if (dailyReport._id === updatedSale?._id) {
                return updatedSale;
              }
              return dailyReport;
            });
          }
          return [updatedSale];
        });
        queryClient.invalidateQueries(["sales", "all"]);
      }
    });
};

// Remove Sale
export const useRemoveSaleMutation = (queryClient: any) => {
  return useMutation((saleID: string) => api.removeSale(saleID),
    {
      onSuccess: (saleID) => {
        queryClient.setQueryData(["sales", "all"], (old: any) => {
          if (old) {
            return old.filter((sale: any) => sale._id !== saleID);
          }
          return [];
        });
        queryClient.invalidateQueries(["sales", "all"]);
      }
    });
};

// Update Sale by key value
interface UpdateSaleByKeyValueParams {
  saleID: string;
  key: string;
  value: any;
}

export const useUpdateSaleByKeyValueMutation = (queryClient: any) => {
  return useMutation(({ saleID, key, value }: UpdateSaleByKeyValueParams) => api.updateSaleByKeyAndValue(saleID, key, value),
    {
      onSuccess: (updatedSale) => {
        queryClient.setQueryData(["sales", "all"], (old: any) => {
          if (old) {
            return old.map((sale: any) => {
              if (sale._id === updatedSale?._id) {
                return updatedSale;
              }
              return sale;
            });
          }
          return [updatedSale];
        });
        queryClient.invalidateQueries(["sales", "all"]);
      }
    });
};