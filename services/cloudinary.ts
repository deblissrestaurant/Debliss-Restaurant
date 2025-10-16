const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;

console.log("Cloudinary upload URL:", CLOUDINARY_UPLOAD_URL);

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    console.log("Starting Cloudinary upload for file:", file.name);

    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image must be less than 5MB");
    }

    console.log("File validation passed");

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    // Optional: Add folder organization
    formData.append("folder", "menu-items");

    console.log("Form data prepared, sending to:", CLOUDINARY_UPLOAD_URL);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    console.log("Response received:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", errorText);
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const result: CloudinaryUploadResult = await response.json();
    console.log("Upload successful! Result:", result);

    // Return the secure URL
    console.log("Returning secure URL:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

// Optional: Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    // Note: Deletion requires backend implementation with Cloudinary admin API
    // This is just a placeholder for future implementation
    console.log("Delete image with public_id:", publicId);
    return true;
  } catch (error) {
    console.error("Failed to delete image:", error);
    return false;
  }
};

// Helper function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  } catch {
    return null;
  }
};
