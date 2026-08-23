import { useMutation } from "@tanstack/react-query";
import api from "./client";

export const useAuth = () => {
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
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (user) => {
      const res = await api.post(
        "/auth/register/",
        {
          username: user.username,
          email: user.email,
          password: user.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
  });
};

