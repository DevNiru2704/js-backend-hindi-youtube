import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

// Middlewares
app.use(cookieParser()) //This allows us to configure cookies.
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"})) //Take limited amount of cookie data because we don't want our website to crash.
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
})) 
app.use(express.static("./public")) //This is to tell express that if I want to keep some assets such as images,svg,video,etc.,
                                 //I will keep it in the public folder.


//routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users",userRouter)  //Using express we could declare routes with app.get directly but here since everything is separate we have to use a middleware. Now the user route will pass on the control to userRouter. Now go to userRouter. Giving versions and api are good practices.
export {app}


//node.js
//express.js
//mongoDB
//npm node package manager