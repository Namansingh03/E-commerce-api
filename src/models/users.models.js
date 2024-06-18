import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
   username : {
    type : String,
    required : true,
    lowercase : true,
    unique : true
   },
   fullName : {
    type : String,
    required : true,
   },
   email : {
    type : String,
    required : true,
    lowercase : true,
    unique : true
   },
   password : {
    type : String,
    required : [true , "password is required"],
    lowercase : true,
    unique : true
   },
   profileImage : {
    type : String,
   },
   orderHistory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Products"
    },
   refreshToken : {
    type : String,
   },
},{timestamps : true});

userSchema.pre("save" , async function (next){

    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()

});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username : this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Users = mongoose.model("Users", userSchema);
