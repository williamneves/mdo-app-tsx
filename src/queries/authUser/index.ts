import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"

import fetchUserDB from "src/@auth/fetchUserDB"

export const useGetAuthUserQuery = (userUID: string, options?: object) => {
  return useQuery(["authUser", [userUID]], () => fetchUserDB(userUID), options)
}
