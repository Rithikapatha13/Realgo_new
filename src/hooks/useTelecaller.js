import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

export const useAddTelecaller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/telecallers", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-data"] });
    },
  });
};
