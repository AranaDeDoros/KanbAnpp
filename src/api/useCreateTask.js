import { useMutation/* , useQueryClient  */} from "@tanstack/react-query";
import api from "./client";

export const useCreateTask = (token) =>
  useMutation({
    mutationFn: async (data) => {
      const isFormData = data instanceof FormData;

      const res = await api.post("/tasks/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });

      return res.data;
    },
  });

/* export const useCreateTask = (token) => {
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
 */