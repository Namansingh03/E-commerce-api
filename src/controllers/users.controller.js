import mongoose from 'mongoose';
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Users } from '../models/users.models.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const existedUser = await Users.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists");
    }

    let imageLocalPath;
    if (req.file) {
        imageLocalPath = req.file.path;
        console.log("Image path: ", imageLocalPath); // Debug log
    } else {
        console.log("No image uploaded"); // Debug log
    }

    const profileImage = await uploadCloudinary(imageLocalPath);
    console.log("Profile image upload result: ", profileImage); // Debug log

    if (!profileImage) {
        throw new apiError(404, "Image not uploaded");
    }

    const user = await Users.create({
        fullName,
        profileImage: profileImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await Users.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const logIn = asyncHandler(async (req , res) => {
    
})

const logOut = asyncHandler(async (req , res) => {

})

const changePassword = asyncHandler(async (req , res) => {

})

const updateUserDetails = asyncHandler(async (req , res) => {

})

const updateProfileImage = asyncHandler(async (req , res) => {

})

const refreshAccessTokes = asyncHandler(async (req , res) => {

})

const getOrderHistory = asyncHandler(async (req , res) => {

})

const getUserProfile = asyncHandler(async (req , res) => {

})


export { 
    registerUser,
    logIn,
    logOut,
    changePassword,
    updateUserDetails,
    updateProfileImage,
    refreshAccessTokes,
    getOrderHistory,
    getUserProfile
};
