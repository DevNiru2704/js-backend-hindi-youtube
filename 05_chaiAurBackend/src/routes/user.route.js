import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser) //Now here /users will work as a prefix and the great thing about this is we dont have to write /users again and again. Our website will be formed as http://localhost:8000/users/register

// router.route("login").post(registerUser) //http://localhost:8000/users/login. We can avoid writing the same code again and again using this process


export default router