import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";

export const useCreateProject = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectDTO) => {
      const res = await api.post(
        "/projects/",
        {
          name: projectDTO.name,
          description: projectDTO.description,
          members: [1],  // Temporary hardcoded member ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};
