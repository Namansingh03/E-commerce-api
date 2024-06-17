import mongoose from 'mongoose';
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import {Users} from '../models/users.models.js'

const registerUser = asyncHandler(async (req , res) => {
    
    const request = req.body
    const {username , fullName , email , password} = request;

    if(!username || !fullName || !email || !password ){
        throw new apiError(401 , "empty field");
    }
    console.log(request)
    console.log("username : ", username);

    const existedUser = await Users.findOne({
        $or : [{username}, {email}]
    });

    if(existedUser){
        throw new apiError(401 , "user already existed")
    }

    const imageLocalPath = req.files?.profileImage[0]?.path

    if(!imageLocalPath){
        throw new apiError(404, "profile image field empty")
    }

    const profileImage = await uploadCloudinary(imageLocalPath);

    if(!profileImage){
        throw new apiError(404,"cloudinary upload failed")
    }

    const user = await Users.create({
        username,
        fullName,
        email,
        password,
        profileImage : profileImage?.url || ""
    })

    const userCreated = await Users.findById(user._id).select("-password -refreshToken")

    if(!userCreated){
        throw new apiError(404, "user not created")
    }
    
    return res.status(200).json(
        200,
        {userCreated},
        "user registered successfully"
    )
})

export {
    registerUser
}