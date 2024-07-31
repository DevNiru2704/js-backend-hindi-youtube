import mongoose from "mongoose"

// const userSchema = new mongoose.Schema({    //Schema is a function/method that takes an object
//     username: String,
//     email: String,
//     isActive: Boolean
// }) 

const userSchema = new mongoose.Schema({
    username: { //This syntax is useful for big projects
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required:[true, "Password must be required"]
    },
    isActive: Boolean
},{timestamps:true}) 

export const User=mongoose.model("User", userSchema)  //In the database, User will be named as lowercase and in plural i.e users
