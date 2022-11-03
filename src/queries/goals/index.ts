import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import * as goalsApi from "./hooks/";
import Goal from "@src/interfaces/Goal";
import Store from "@src/interfaces/Store";

// Get All Goals
const useGetAllGoalsQuery = (options?: Object) => {
  return useQuery(["goals", "all"], goalsApi.getAllGoals, {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,
  });
}

// Get Goals By Reference
const useGetGoalsByStoreQuery = (storeId: string, options?: Object) => {
  return useQuery(["goals", "store", storeId], () => goalsApi.getGoalsByStore(storeId), {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,

    enabled: !!storeId,
  });
}

// Get Goal By Id
const useGetGoalByIdQuery = (id: string, options?: Object) => {
  return useQuery(["goals", "id", id], () => goalsApi.getGoalById(id), {
    // 1hr stale time
    staleTime: 1000 * 60 * 60,
    // 6hr cache time
    cacheTime: 1000 * 60 * 60 * 6,
    //
    refetchOnWindowFocus: true,
    ...options,
    enabled: !!id,
  });
}

// Create Goal
const useCreateGoalMutation = (queryClient: any) => {
  return useMutation((goal: Goal) => goalsApi.createGoal(goal), {
    onSuccess: (newGoal: Goal) => {
      const goals = queryClient.getQueryData(["goals", "all"]);
      if (goals) {
        queryClient.setQueryData(["goals", "all"], [...goals, newGoal]);
      }

      // @ts-ignore
      newGoal.targetStores.forEach((store: Store) => {
        const goals = queryClient.getQueryData(["goals", "store", store?._id]);
        if (goals) {
          queryClient.setQueryData(["goals", "store", store?._id], [...goals, newGoal]);
        }
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["goals", "all"]);
      queryClient.invalidateQueries(["goals", "store"]);
    }
  });
}

// Update Goal
const useUpdateGoalMutation = (queryClient: any) => {
  return useMutation(({id, goal}: {id: string, goal:Partial<Goal>}) => goalsApi.updateGoal(id, goal), {
    onSuccess: (updatedGoal: Goal) => {
      const goals = queryClient.getQueryData(["goals", "all"]);
      if (goals) {
        queryClient.setQueryData(["goals", "all"], goals.map((goal: Goal) => {
          if (goal._id === updatedGoal._id) {
            return updatedGoal;
          }

          return goal;
        }));
      }

      // @ts-ignore
      updatedGoal.targetStores.forEach((store: Store) => {
        const goals = queryClient.getQueryData(["goals", "store", store?._id]);
        if (goals) {
          queryClient.setQueryData(["goals", "store", store?._id], goals.map((goal: Goal) => {
            if (goal._id === updatedGoal._id) {
              return updatedGoal;
            }

            return goal;
          }));
        }
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["goals", "all"]);
      queryClient.invalidateQueries(["goals", "store"]);
    }
  });
}
