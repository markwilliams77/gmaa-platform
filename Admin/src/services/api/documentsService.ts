import api from "./client";

export const documentsService = {
  getWorkspaceDocuments: async (
    threadId: string
  ) => {
    const response = await api.get(
      `/documents/workspace/${threadId}`
    );

    return response.data.documents;
  },

  getUploadUrl: async (
  threadId: string,
  fileName: string,
  contentType: string
) => {
  const response = await api.post(
    "/documents/upload-url",
    {
      leadId: threadId,
      fileName,
      contentType,
    }
  );

  return response.data;
},

createWorkspaceDocument: async (
  payload: any
) => {
  const response = await api.post(
    "/documents/workspace",
    payload
  );

  return response.data;
},

deleteWorkspaceDocument: async (
  id: string
) => {
  const response = await api.delete(
    `/documents/workspace/${id}`
  );

  return response.data;
},
};
