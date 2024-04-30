import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function uploadToCloudinary(locaFilePath) {
  var filePathOnCloudinary =locaFilePath.slice(8);

  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary },{
      resource_type: "auto",
      folder: "Build/uploads",
      use_filename: true,
    })
    .then((result) => {
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log(error.message);
      return { message: "Fail" };
    });
}

export const deleteFromCloudinary = async (fileToDelete) => {
  const publicId = extractPublicId(fileToDelete);
  return cloudinary.uploader.destroy(publicId, (error, result) => {
    console.log("result :: ", result);
  });
};
