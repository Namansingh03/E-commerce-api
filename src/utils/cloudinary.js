import {v2 as cloudinary} from "cloudinary";
import fs from 'fs';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_URL,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadCloudinary = async (localFile) => {
    try {
        if(!localFile) return null ;
        const response = await cloudinary.uploader.upload(localFile , {
            resource_type : "auto"
        })

        fs.unlinkSync(localFile)
        return response

    } catch (error) {
        fs.unlinkSync(localFile)
        return null
    }
} 

export {uploadCloudinary}