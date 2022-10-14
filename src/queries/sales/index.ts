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