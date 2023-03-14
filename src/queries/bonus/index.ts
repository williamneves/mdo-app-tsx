import { useQuery, useMutation } from "@tanstack/react-query"
import IBonus from "interfaces/Bonus"
import * as bonusApi from "./hooks"

// Get All Bonuses
export const useGetAllBonusQuery = (options?: Object) => {
  return useQuery(["bonus", "all"], bonusApi.getAllBonus, {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options
  })
}

// Get Bonus By ReferenceId
export const useGetBonusByReferenceIdQuery = (
  referenceId: string,
  options?: Object
) => {
  return useQuery(
    ["bonus", "referenceId", `${referenceId}`],
    () => bonusApi.getBonusByReferenceId(referenceId),
    {
      // 1hr stale time
      staleTime: 1000 * 60 * 60,
      // 6hr cache time
      cacheTime: 1000 * 60 * 60 * 6,
      //
      refetchOnWindowFocus: true,

      enabled: !!referenceId,

      ...options
    }
  )
}

// Create Bonus
export const useCreateBonusQuery = (queryClient: any) => {
  return useMutation((bonus: IBonus) => bonusApi.createBonus(bonus), {
    onSuccess: newBonus => {
      queryClient.setQueryData(["bonus", "all"], (old: any) => {
        if (old) {
          return [...old, newBonus]
        }
        return [newBonus]
      })
      queryClient.invalidateQueries(["bonus", "all"])
    }
  })
}

// Update Bonus
export const useUpdateAllBonusQuery = (queryClient: any) => {
  return useMutation((bonus: IBonus) => bonusApi.updateAllBonus(bonus), {
    onSuccess: updatedBonus => {
      queryClient.setQueryData(["bonus", "all"], (old: any) => {
        if (old) {
          return old.map((bonus: any) => {
            if (bonus._id === updatedBonus._id) {
              return updatedBonus
            }
            return bonus
          })
        }
        return [updatedBonus]
      })
      queryClient.invalidateQueries(["bonus", "all"])
    }
  })
}

// Update Bonus
export const useUpdateBonusFieldsQuery = (queryClient: any) => {
  return useMutation(
    ({ id, bonus }: { id: string; bonus: Partial<IBonus> }) =>
      bonusApi.updateBonusFields(id, bonus),
    {
      onSuccess: updatedBonus => {
        queryClient.setQueryData(["bonus", "all"], (old: any) => {
          if (old) {
            return old.map((bonus: any) => {
              if (bonus._id === updatedBonus._id) {
                return updatedBonus
              }
              return bonus
            })
          }
          return [updatedBonus]
        })
        queryClient.invalidateQueries(["bonus", "all"])
      }
    }
  )
}

// Delete Bonus
export const useDeleteBonusQuery = (queryClient: any) => {
  return useMutation((id: string) => bonusApi.deleteBonus(id), {
    onSuccess: deletedBonus => {
      queryClient.setQueryData(["bonus", "all"], (old: any) => {
        if (old) {
          return old.filter((bonus: any) => bonus._id !== deletedBonus._id)
        }
        return []
      })
      queryClient.invalidateQueries(["bonus", "all"])
    }
  })
}
