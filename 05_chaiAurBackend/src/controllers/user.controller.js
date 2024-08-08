import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    // res.status(200).json({
    //     message:"chai aur code"
    // })
    
    //ALGORITHM
    //get details from frontend
    //validation
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //check user object
    //remove password and refresh field from response 
    //check for user creation
    //return res or return error

    const {fullName,username,email,password} = req.body //if the data is coming from forms or json, we use req.body otherwise we can use multer. //get details from frontend
    console.log(req.body)
    console.log("fullName,username,email,password ",fullName,username,email,password)
    if(
        [fullName,username,email,password].some((field)=>{return field.trim===""})//validation
    ){
        throw new ApiError(400,"All field are required.")
    }

    const existingUsers=User.findOne({
        $or:[{username},{email}]
    })

    if(existingUsers){
        throw new ApiError(409,"Users with email or username already exists!")//check if user already exists: username, email
    }

    if(!avatarLocalPath){
        throw new ApiError("400","Avatar file is required!") //coverImage is optional field
    }

    const avatarLocalPath=req.files?.avatar[0]?.path //check for images, check for avatar
    const coverImageLocalPath=req.files?.coverImage[0]?.path 
    console.log(avatarLocalPath)
    console.log(coverImageLocalPath)

    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath) //Uploading an image may take some time. That's why await.
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("400","Avatar file is required!")
    }

    //create user object - create entry in db

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //check user object
    const createdUser = await User.findById(user.__id).select("-password -refreshToken") //In the select function we give the name of the keys that we do not want

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfull")
    )
})

export {registerUser}