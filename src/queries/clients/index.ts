import { useQuery, useMutation } from "@tanstack/react-query";
import * as useClient from "./hooks/useClient";

export const useGetClientsQuery = (options?: Object) => {
  return useQuery(["clients", "all"], useClient.getAllClients, options);
};

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