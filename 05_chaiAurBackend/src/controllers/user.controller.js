import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary, deleteOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshToken= async (userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken //We 
        await user.save({validateBeforeSave:false}) // If we don't pass the validateBeforeSave parameter, all the required field inside the user model will kick in and give us an error
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError("500","Something went wrong while generating access and refresh tokens!")
    }
}

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

    const existingUsers=await User.findOne({
        $or:[{username},{email}]
    })
    if(existingUsers){
        throw new ApiError(409,"Users with email or username already exists!")//check if user already exists: username, email
    }

    

    const avatarLocalPath=req.files?.avatar[0]?.path //check for images, check for avatar
    if(!avatarLocalPath){
        throw new ApiError("400","Avatar file is required1!") //coverImage is optional field
    }
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path 
    }
    console.log(avatarLocalPath)
    console.log(coverImageLocalPath)
    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath) //Uploading an image may take some time. That's why await.
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("400","Avatar file is required2!")
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
    const createdUser = await User.findById(user._id).select("-password -refreshToken") //In the select function we give the name of the keys that we do not want

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesful")
    )
})

const loginUser=asyncHandler(async (req,res,next)=>{
    //req.body->data
    //check username or email
    //find the user in the db
    //if user exist check password
    //if password is correct, generate access and refresh token
    //send the tokens in the cookies
    const {username,email,password}=req.body
    // console.log(email)
    if(!username && !email){
        throw new ApiError(400,"Username or email required!")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError("400","User does not exist!")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError("400","Password is Invalid!")
    }

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const {accessToken,refreshToken,}=await generateAccessAndRefreshToken(user._id)

    // console.log("Access Token: ",accessToken)
    // console.log("Refresh Token: ",refreshToken)

    const options={
        httpOnly:true,
        secure: true
    }
    // console.log(res.cookie("accessToken",accessToken,options))
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,refreshToken,accessToken
        })
    )
})

const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            },
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse("200",{},`${req.user.username} logged out successfully!`)
    )
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken  || req.body.refreshToken
    if(!incomingRefreshToken)
        throw new ApiError(400,"Unauthorized request!")
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(400,"Invalid Refresh Token!")
        }
    
        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401,"Refresh token is expired or used!")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newRefreshToken
                },
                "Access Token Refreshed!"
            )
        )
    } catch (error) {
         throw new ApiError(
            401,
            error?.message|| "Invalid Refresh Token!"
         )
    }

})

const changeCurrentPassword=asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body
    if(newPassword!==confirmPassword){
        throw new ApiError("401","Invalid new password!")
    }
    const user = await User.findById(req?.user._id)

    if(!user){
        throw new ApiError("401","User does not exist!")
    }

    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError("401","Invalid old password!")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password Changed Successfully!"
    ))
})

const getCurrentUser=asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"Current user fetched successfully!")
    )
})

const updateUserAccount=asyncHandler(async (req,res)=>{
    const {fullName,username,email}=req.body
    if(!fullName||!username||!email){
        throw new ApiError("401","All fields are required!")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                username,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account details updated successfully!"
    ))
})

const updateUserAvatar=asyncHandler(async (req,res)=>{
    const avatarLocalPath=req.file?.path
    

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar Path does not exist")
    }

    console.log(avatarLocalPath)

    const avatar=await uploadOnCloudinary(avatarLocalPath)


    if(!avatar.url){
        throw new ApiError(400,"Error while uploading avatar!")
    }

    const user=await User.findById(req?.user._id)

    if(!user){
        throw new ApiError("400","User does not exist!")
    }

    if(user.avatar){ //Delete existing coverId from cloudinary
        const publicId=user.avatar.split('/').pop().split('.')[0]
        await deleteOnCloudinary(publicId)
    }

    user.avatar=avatar.url
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Avatar updated successfully!"
    ))
})

const updateUserCoverImage=asyncHandler(async (req,res)=>{
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image Path does not exist")
    }

    console.log(coverImageLocalPath)

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading cover image!")
    }

    const user=await User.findById(req?.user._id)

    if(!user){
        throw new ApiError("400","User does not exist!")
    }

    if(user.coverId){ //Delete existing coverId from cloudinary
        const publicId=user.coverId.split('/').pop().split('.')[0]
        await deleteOnCloudinary(publicId)
    }

    user.coverImage=coverImage.url
    await user.save({validateBeforeSave:false})


    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Cover Image updated successfully!"
    ))
})

const getUserChannelProfile=asyncHandler(async (req,res)=>{
    const {username}=req.params
    if(!username?.trim()){
        throw new ApiError(400,"Username does not exist!")
    }

    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                email:1,
                subscriberCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1

            },
        }
    ])
    console.log(channel)

    if(!channel?.length){
        throw new ApiError(404,"Channel does not exist!")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,channel[0],"User channel fetched successfully!"))
} )

const getWatchHistory=asyncHandler(async (req,res)=>{
    const user= await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)

            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        email:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $arrayElemAt:["$owner",0]
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully!"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAccount,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory

}