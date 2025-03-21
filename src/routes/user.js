import { Router } from "express";
import { register } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
const userRouter = Router();
userRouter.route('/register').post(
    upload.fields([{name:"avtar",maxCount:1}]),
    register
);


export { userRouter };