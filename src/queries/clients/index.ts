import { useQuery, useMutation } from "@tanstack/react-query";
import * as useClient from "./hooks/useClient";

export const useGetClientsQuery = (options?: Object) => {
  return useQuery(["clients", "all"], useClient.getAllClients, {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,
  });
};

// Get All Clientes By ReferenceId
export const useGetClientsByReferenceIdQuery = (referenceId:{referenceId: string}, options?: Object) => {
  return useQuery(["clients", 'referenceId',`${referenceId.referenceId}`], () => useClient.getAllClientsByReferenceId(referenceId), {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,
  });
}

export const useCreateClientQuery = (queryClient: any) => {
  return useMutation((client: any) => useClient.createClient(client),
    {
      onSuccess: (newClient) => {
        queryClient.setQueryData(["clients", "all"], (old: any) => {
          if (old) {
            return [...old, newClient];
          }
          return [newClient];
        });
        queryClient.invalidateQueries(["clients", "all"]);
      }
    });
};

export const useUpdateClientQuery = (queryClient: any) => {
  return useMutation((client: any) => useClient.updateClient(client),
    {
      onSuccess: (updatedClient) => {
        queryClient.setQueryData(["clients", "all"], (old: any) => {
          if (old) {
            return old.map((client: any) => {
              if (client._id === updatedClient._id) {
                return updatedClient;
              }
              return client;
            });
          }
          return [updatedClient];
        });
        queryClient.invalidateQueries(["clients", "all"]);
      }
    });
};