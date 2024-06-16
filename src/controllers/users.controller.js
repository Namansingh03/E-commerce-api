import mongoose from 'mongoose';
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadCloudinary} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req , res) => {
    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "ok"
        )
    )
})

export {
    registerUser
}