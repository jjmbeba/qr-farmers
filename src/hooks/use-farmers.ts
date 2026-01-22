import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import type { farmerSchema } from "@/db/utils";
import {
  createFarmer,
  deleteFarmer,
  getFarmers,
  updateFarmer,
} from "@/utils/farmers.functions";

type Farmer = z.infer<typeof farmerSchema>;

// Query hook for fetching all farmers
export const useFarmers = () => {
  return useQuery({
    queryKey: ["farmers"],
    queryFn: async () => {
      return await getFarmers();
    },
  });
};

// Mutation hook for creating a farmer
export const useCreateFarmer = (
  options?: Omit<
    UseMutationOptions<Farmer, Error, Farmer, unknown>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmer: Farmer) => createFarmer({ data: farmer }),
    onSuccess: () => {
      // Invalidate and refetch farmers query after successful creation
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
    },
    ...options,
  });
};

// Mutation hook for updating a farmer
export const useUpdateFarmer = (
  options?: Omit<
    UseMutationOptions<Farmer, Error, Farmer, unknown>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmer: Farmer) => updateFarmer({ data: farmer }),
    onSuccess: () => {
      // Invalidate and refetch farmers query after successful update
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
    },
    ...options,
  });
};

// Mutation hook for deleting a farmer
export const useDeleteFarmer = (
  options?: Omit<
    UseMutationOptions<Farmer, Error, string, unknown>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFarmer({ data: { id } }),
    onSuccess: () => {
      // Invalidate and refetch farmers query after successful deletion
      queryClient.invalidateQueries({ queryKey: ["farmers"] });
      toast.success("Farmer deleted successfully");
    },
    ...options,
  });
};
