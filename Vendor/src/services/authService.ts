import { api } from "./api";

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post(
      "/auth/vendor-login",
      {
        username,
        password,
      }
    );

    return response.data;
  },
};