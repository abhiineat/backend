import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';
dotenv.config();
const connect = async () => {
    try {
        const connectionH=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
         console.log(`MongoDB connected ${connectionH.connection.host}`);
    } catch (error) {
        console.log("mongodb connection failed",error);
    }
}
export default connect;