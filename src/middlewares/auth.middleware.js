import {Users} from "../models/users.models.js";
import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const authJWT = asyncHandler(async (req , res , next) => {
     try {
        
       const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer" , "");

       if(!token){
        throw new apiError(401 , "invalid access token");
       }

       const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

       const user = await Users.findById(decodedToke._id).select("-password -refreshToken")

       if(!user){
        throw new apiError(404 , "user not found");
       }

       req.user = user;
       next()

     } catch (error) {
        throw new apiError(401 , error?.message || "invalid access token")
     }
})