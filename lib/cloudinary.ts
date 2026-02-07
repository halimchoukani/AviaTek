export const uploadImageToCloudinary = async (
  organization: string,
  academy: string,
  equipmentType: string, // "Planes" | "Simulators"
  fileUri: string
): Promise<string> => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.replace(/['"]+/g, '');
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.replace(/['"]+/g, '');

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing (Cloud Name or Upload Preset)');
  }

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const data = new FormData();

  const fileExtensionMatch = /\.(\w+)$/.exec(fileUri);
  const fileExtension = fileExtensionMatch ? fileExtensionMatch[1] : "jpg";

  const publicId = `${equipmentType}_${Date.now()}`;

  // @ts-ignore
  data.append("file", {
    uri: fileUri,
    name: `${publicId}.${fileExtension}`,
    type: `image/${fileExtension}`,
  });

  data.append("upload_preset", uploadPreset);
  data.append("folder", `${organization}/${academy}/${equipmentType}`);
  data.append("public_id", publicId);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("Cloudinary Error:", result.error);
      throw new Error(result.error?.message || "Upload failed");
    }

    return result.secure_url;

  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};
