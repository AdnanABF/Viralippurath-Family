import axios from "axios";
import imageCompression from "browser-image-compression";
import api from "./api";
import toast from "react-hot-toast";

interface UploadConfig {
  compress?: boolean;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * Service to handle direct uploads to Cloudinary for both Gallery (Images) and Magazines (PDFs).
 */
export const cloudinaryUploadService = {
  async uploadFile(file: File, folder: string, config: UploadConfig = {}) {
    let fileToUpload = file;

    // 1. Optional Compression Step (Images only)
    if (config.compress && file.type.startsWith("image/")) {
      try {
        const options = {
          maxSizeMB: config.maxSizeMB || 4, // Default to 2MB if not specified
          maxWidthOrHeight: config.maxWidthOrHeight || 1920, // Keep high res but cap at 1080p/2K
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options);
      } catch (error) {
        toast.error("Image compression failed, uploading original file.");
        // Fallback to original file if compression fails for any reason
        fileToUpload = file;
      }
    }

    // 2. Get signature from Backend
    const signData = (await api.get<{
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
      cloudName: string;
    }>(`/cloudinary/sign?folder=${folder}`)) as any;

    // 3. Prepare Form Data for Cloudinary
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp.toString());
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    // 4. Upload directly to Cloudinary
    // Note: 'auto' resource_type handles both 'image' and 'raw' (PDFs)
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
      formData,
    );

    // 5. Return a generalized response
    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      resourceType: response.data.resource_type, // 'image' or 'raw'
      bytes: response.data.bytes,
    };
  },
};
