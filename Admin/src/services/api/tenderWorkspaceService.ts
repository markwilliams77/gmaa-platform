import api from "./client";

export const tenderWorkspaceService = {
  getThreads: async () => {
    const response = await api.get(
      "/support/threads"
    );

    return response.data;
  },

  getMessages: async (
    threadId: string
  ) => {
    const response = await api.get(
      `/support/${threadId}/messages`
    );

    return response.data;
  },

  sendMessage: async (
    threadId: string,
    content: string
  ) => {
    const response = await api.post(
      `/support/${threadId}/messages`,
      {
        content,
      }
    );

    return response.data;
  },
};