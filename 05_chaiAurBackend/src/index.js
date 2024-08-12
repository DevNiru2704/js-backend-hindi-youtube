// require("dotenv").config({path:"../env"}) //It ruins the consistency of our program because it is not yet possible to use es6 yet.
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import {} from "./constants.js";
import {connectDB} from "./db/index.js"
import { app } from "./app.js";

dotenv.config({
    path:"../.env"
})

//connectDB returns a promise because connectDB is an async await function
const port=process.env.PORT||3000
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR: ",error);
        throw error
    })
    app.listen(port,()=>{
        console.log(`Server is running at port:${port}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed: ",error)
}) 









/*
const app=express();

;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("ERROR: ",error);
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }catch(error){
        console.error("ERROR: ",error);
        throw error
    }
})();
*/