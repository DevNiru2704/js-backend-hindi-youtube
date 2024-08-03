// import mongoose from "mongoose";

// const videoSchema=new mongoose.Schema({

// })

// export const Video=mongoose.model("Video",videoSchema)

import mongoose, {Schema} from mongoose; //we are direcly importing Schema method here so for easy reuse
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
    videoFile:{
        type:String,
        requred:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //cloudinary
        required:true
    },
    title:{
        type:String,
        required:true
    },
    view:{
        type:Number,
        default:0,
        required:true
    },
    isPublished:{
        type:Boolean,
        required:true,
        default:true
    }
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model("Video",videoSchema)