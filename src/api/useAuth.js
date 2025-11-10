import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./client";

export const useAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user) => {
      const res = await api.post(
        "/auth/login/",
        {
          username: user.username,
          password: user.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      // Opcional: refresca las tareas después de crear una
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
