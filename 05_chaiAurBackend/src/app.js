import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //Take limited amount of cookie data because we don't want our website to crash.

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
})) 

app.use(express.static("public")) //This is to tell express that if I want to keep some assets such as images,svg,video,etc.,
                                 //I will keep it in the public folder.

app.use(cookieParser()) //This allows us to configure cookies.

export {app}