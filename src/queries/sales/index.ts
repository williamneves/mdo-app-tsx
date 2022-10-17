import { useQuery } from "@tanstack/react-query";
import * as api from "./hooks";

// Get SaleNumber
export const useGetSaleNumberQuery = (options?: Object) => {
  return useQuery(["saleNumber", "all"],
    api.getSaleNumber,
    {
      // No Stale Time
      staleTime: 0,
      // 1hr cache time
      cacheTime: 1000 * 60 * 60,
      //
      refetchOnWindowFocus: true,
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

// Get Pending Sales
export const usePendingSalesQuery = (options?: Object) => {
  return useQuery(["sales", "pending"],
    api.getPendingSales,
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