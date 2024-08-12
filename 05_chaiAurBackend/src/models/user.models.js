// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({

// })

// export const User=mongoose.model("User",userSchema)

import mongoose, {Schema} from "mongoose"; //we are direcly importing Schema method here so for easy reuse

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //JWT is a bearer token. This means that if anyone has this token, they will get the data.
const userSchema = new Schema(
    {
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
                required: true,
            },
        ],
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, //cloudinary url will be used
            required: true,
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is incorrect"],
        },
        refreshToken: {
            type: String,
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
    //This is a middleware hooks. We can modify the file before it uploads using pre or after using post, etc. Here arrow functions should not be used because they do have the reference of this keyword. The function should also be an asynchronous function because excrypting, hashing, etc. these all take time so we want this process running on the background.
    // this.password=bcrypt.hash(this.password,10) //we have encrypted this password but there is a problem. Whenever the data is saved it will encrypt the password . But we want to only encrypt the password one time. To avoid this we need to give a check.
    if (this.isModified("password")) {
        //This solves the problem
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    //We are making a function that compares whether the password is correct or not.
    return await bcrypt.compare(password, this.password); //this.password is the correct password.
};

userSchema.methods.generateAccessToken = async function () { //Access tokens are short lived
    return jwt.sign(
        {
            //This is a payload. In a JSON Web Token (JWT), a payload is just an object that contains the actual data or claims about the user or the session, such as user ID or roles.

            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    ); //generates a sign in token
};

userSchema.methods.generateRefreshToken = async function () { //Refresh tokens are long lived
    return jwt.sign(
        {
            //Refresh token has less information
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    ); //generates a sign in token
};

export const User = mongoose.model("User", userSchema);
