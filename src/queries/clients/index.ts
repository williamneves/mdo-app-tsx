import { useQuery } from "@tanstack/react-query";
import useClient from "../../hooks/useClient";

const useGetClientsQuery = (options?: Object) => {
  const { getAllClients } = useClient();
  return useQuery(["clients"], getAllClients, options);
};

export default useGetClientsQuery;