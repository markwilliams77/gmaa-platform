import { api } from "./api";
import { setCsrfToken } from "./api";

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post(
      "/auth/vendor-login",
      {
        username,
        password,
      }
    );

    setCsrfToken(response.data.csrfToken);

    return response.data;
  },

  async logout() {
    await api.post("/auth/logout", {});
  },
};