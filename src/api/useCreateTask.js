import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";

export const useCreateTask = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectDTO) => {
      const res = await api.post(
        "/tasks/",
        {
          title: projectDTO.title,
          description: projectDTO.description,
          status: projectDTO.status,
          project: projectDTO.project,
          estimate_points: projectDTO.estimate_points,
          priority: projectDTO.priority,
          acceptance_criteria: projectDTO.acceptance_criteria,
          assigned_to: projectDTO.assigned_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
