import api from "./client";

export const uploadsService = {
  getPresignedUrl: async (
    module: string,
    ownerId: string,
    folder: string,
    file: File
  ) => {
    const response = await api.post(
      "/api/uploads/presigned-url",
      {
        module,
        ownerId,
        folder,
        fileName: file.name,
        contentType: file.type,
      }
    );

    return response.data;
  },

  uploadFile: async (
    uploadUrl: string,
    file: File
  ) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
  },

  upload: async (
    module: string,
    ownerId: string,
    folder: string,
    file: File
  ) => {
    const {
      uploadUrl,
      fileUrl,
    } = await uploadsService.getPresignedUrl(
      module,
      ownerId,
      folder,
      file
    );

    await uploadsService.uploadFile(
      uploadUrl,
      file
    );

    return fileUrl;
  },
};