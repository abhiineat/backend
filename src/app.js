import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json(
    {
        limit: '50kb' 
    }
));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

import { userRouter } from "./routes/user.js";

app.use('/api/users', userRouter); 


export { app };