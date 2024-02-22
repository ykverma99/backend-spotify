import cloudinary from "../utils/cloudinary.js";

const storeCloud = async (filePath, resouceType) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "spotify-clone",
      resource_type: resouceType || "image",
    });
    return result.url;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};

export default storeCloud;
