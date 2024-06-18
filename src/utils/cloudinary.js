import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFile) => {
    try {
        if (!localFile) return null;

        if (!fs.existsSync(localFile)) {
            console.error(`File not found: ${localFile}`);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFile, {
            resource_type: "auto"
        });

        if (fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
        }

        return response;

    } catch (error) {
        console.error("Cloudinary upload error: ", error);

        if (fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
        }

        return null;
    }
};

export { uploadCloudinary };
