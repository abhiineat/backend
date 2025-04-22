import { Router } from "express";
import { register, login, logout } from "../controllers/user.js"; // ✅ Fixed here
import { upload } from "../middlewares/multer.js";
import { VerifyJWT } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.route('/register').post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    register
);

userRouter.route('/login').post(login); // ✅ Fixed here


userRouter.route('/logout').post(VerifyJWT, logout); 

export { userRouter };
