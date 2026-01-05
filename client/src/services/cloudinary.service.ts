import axios from "axios";
import api from "./api";

export const cloudinaryUploadService = {
  async uploadFile(file: File, folder: string) {
    // 1. Get signature from Backend
    const { data: signData } = await api.get(
      `/cloudinary/sign?folder=${folder}`
    );

    // 2. Prepare Form Data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp.toString());
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    // 3. Upload directly to Cloudinary (bypassing Vercel limit)
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
      formData
    );

    return {
      pdfUrl: response.data.secure_url,
      cloudinaryPublicId: response.data.public_id,
    };
  },
};
