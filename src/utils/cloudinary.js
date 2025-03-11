import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//~ ✅ fs (File System) ek built-in library hai jo Node.js ke core modules ka hissa hai.
//~ fs (File System) module Node.js ka built-in module hai, jo file handling operations perform karne ke liye use hota hai. Iska use files ko read, write, delete, update, rename, aur manipulate karne ke liye hota hai.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //* in case of no file path exist
    if (!localFilePath) return null;

    //* upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log(
    //   "File has been uploaded successfully on cloudinary",
    //   response.url
    // );
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    //* in case of error locally saved temporary file will be  deleted
    return null;
  }
};

export { uploadOnCloudinary };
