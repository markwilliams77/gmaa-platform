import { api } from "./api";

export const vendorService = {

  getMe: async () => {
  const response = await api.get("/vendor/me");
  return response.data;
},

  getTenders: async () => {
    const response = await api.get(
      "/vendor/tenders"
    );

    return response.data;
  },

  getMyTenders: async () => {
    const response = await api.get(
        "/vendor/my-tenders"
    );
    return response.data;
}, 

  submitBid: async (
  tenderId: string,
  amount: number,
  proposal?: string
) => {
  const response = await api.post(
    "/vendor/bids",
    {
      tenderId,
      amount,
      proposal,
    }
  );

  return response.data;
},

getConsultations: async () => {
  const response = await api.get(
    "/vendor/consultations"
  );

  return response.data;
},

updateConsultationStatus: async (
  id: string,
  status: string
) => {
  const response = await api.patch(
    `/vendor/consultations/${id}/status`,
    {
      status,
    }
  );

  return response.data;
},

getWorkspaceDocuments: async (
  threadId: string
) => {
  const response = await api.get(
    `/documents/workspace/${threadId}`
  );

  return response.data.documents;
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

uploadVendorDocument: async (
  file: File,
  documentType: string,
  folder = "verification"
) => {
  // Step 1 - Get signed upload URL
  const uploadResponse = await api.post(
    "/vendor-documents/upload-url",
    {
      folder,
      fileName: file.name,
      contentType: file.type,
    }
  );

  const { uploadUrl, s3Key } = uploadResponse.data;

  // Step 2 - Upload directly to S3
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  // Step 3 - Save document record
  const response = await api.post(
    "/vendor-documents",
    {
      documentType,
      fileName: file.name,
      fileSize: file.size,
      s3Key,
    }
  );

  return response.data;
},

getVendorDocuments: async () => {
  const response = await api.get(
    "/vendor-documents/me"
  );

  return response.data.documents;
},

deleteVendorDocument: async (
  id: string
) => {
  const response = await api.delete(
    `/vendor-documents/${id}`
  );

  return response.data;
},  

submitVerification: async () => {
  const response = await api.post(
    "/vendor/verification/submit"
  );

  return response.data;
},

};

