import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
const registerUser = asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"chai aur code"
    // })
    
    //get details from frontend
    //validation
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh field from response 
    //check for user creation
    //return res or return error

    const {fullName,username,email,password} = req.body //if the data is coming from forms or json, we use req.body otherwise we can use multer
    console.log("fullName,username,email,password ",fullName,username,email,password)
    if(
        [fullName,username,email,password].some((field)=>{return field.trim===""})
    ){
        throw new ApiError(400,"All field are required.")
    }
})

export {registerUser}