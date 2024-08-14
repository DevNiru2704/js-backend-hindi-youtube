import {Router} from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT  } from "../middlewares/auth.middleware.js";
const router = Router()

// router.route("/register").post(registerUser) //Now here /users will work as a prefix and the great thing about this is we dont have to write /users again and again. Our website will be formed as http://localhost:8000/users/register

router.route("/register").post( //We use multer here because res.body cannot handle data coming from an url
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secure route

router.route("/logout").post(verifyJWT ,logoutUser)

// router.route("login").post(registerUser) //http://localhost:8000/users/login. We can avoid writing the same code again and again using this process



export default router