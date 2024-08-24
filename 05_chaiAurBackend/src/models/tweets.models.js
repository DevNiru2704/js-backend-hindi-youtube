import mongoose, {Schema} from "mongoose";

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videos: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamps: true}
);

export const Tweet = mongoose.model("Tweet", TweetSchema);
