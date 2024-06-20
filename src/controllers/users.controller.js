import mongoose from 'mongoose';
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Users } from '../models/users.models.js';

const options = {
    httpOnly : true,
    secure : true
 }

const generateAccessAndRefreshToken = async (userId) => {
        try {
            
           const user = await Users.findById(userId)
           const accessToken = user.generateAccessToken();
           const refreshToken = user.generateRefreshToken();

           user.refreshToken = refreshToken
           await user.save({validatedBeforeSave : false})

           return {accessToken , refreshToken}

        } catch (error) {
            throw new apiError(500, "Something went wrong while generating refresh and access token")
        }
} 

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
    const {username , email , password} = req.body
    if(!email && !username){
        throw new apiError(400 , "fields empty")
    }

    const user = Users.findOne({
        $or : [{username} , {email}]
    })

    if (!user) {
        throw new apiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new apiError(500 , "invalid password")
    }
 
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await Users.findById(user._id).select("-password -refreshToken")

    return res.status(200)
    .cookies("accessToken" , accessToken , options)
    .cookies("refreshToken" , refreshToken , options)
    .json(
        new apiResponse(
            200, 
            {
                user : loggedInUser , accessToken , refreshToken
            },
            "User loggedIn successfully"
        )
    )
   
})

const logOut = asyncHandler(async (req , res) => {
     await Users.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
     )

     return res.status(200)
     .clearCookies("accessToken", options)
     .clearCookies("refreshToken", options)
     .json(
        new apiResponse(
            200,
            {},
            "user logged out successFully"
        )
     )
})

const changePassword = asyncHandler(async (req , res) => {
    const {oldPassword , newPassword} = req.body
   
    if(!oldPassword && !ewPassword){
        throw new apiError(400 , "fields are empty")
    }

    const user = await Users.findById(req.user?._id)

    if(!user){
        throw new apiError(401 , "user not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new apiError(404 , "invalid password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false});

    return res.status(200)
    .json(
        new apiResponse(
            200, 
            {},
            "password changed successfully"
        )
    )

})

const updateUserDetails = asyncHandler(async (req , res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new apiError(400, "All fields are required")
    }

    const user = await Users.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))
})

const updateProfileImage = asyncHandler(async (req , res) => {
    const profileLocalPath = req.file?.path
    
    if(!profileLocalPath){
        throw new apiError(400 , "provide a profile image")
    }

    const ProfileImage = await uploadCloudinary(profileLocalPath)

    if(!ProfileImage){
        throw new apiError(404 , "cloudinary upload failed")
    }
   
    const user = await user.findByIdAndUpdate(
        req.user?._id,
        {
           $ste : {
            profileImage : ProfileImage?.url
           }
        },
        {
           new : true
        }
    ).select("-password")

    return res.status(200)
    .json(
        new apiResponse(
            200,
            {user},
            "profile image uploaded successfully "
        )
    )
    
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
