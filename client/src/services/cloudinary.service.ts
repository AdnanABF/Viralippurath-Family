import axios from "axios";
import api from "./api";

/**
 * Service to handle direct uploads to Cloudinary.
 */
export const cloudinaryUploadService = {
  async uploadFile(file: File, folder: string) {
    // 1. Get signature from Backend
    // Use 'as any' or casting because our interceptor changes the standard Axios return behavior
    const signData = (await api.get<{
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
      cloudName: string;
    }>(`/cloudinary/sign?folder=${folder}`)) as any;

    // 2. Prepare Form Data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp.toString());
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    // 3. Upload directly to Cloudinary (bypassing serverless/Vercel limits)
    // Using raw axios is correct here as it doesn't have the modified interceptor
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
