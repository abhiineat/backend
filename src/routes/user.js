import { Router } from "express";
import { register } from "../controllers/user.js";
const userRouter = Router();
userRouter.route('/register').post(register);


export { userRouter };