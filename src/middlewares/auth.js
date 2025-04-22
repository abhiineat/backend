import jwt from "jsonwebtoken";
import { asynchandle } from "../utils/asynchandler.js";
import { User } from "../models/user.js";

export const VerifyJWT = asynchandle(async (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = 
        req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Attach user to request (optional: fetch from DB if needed)
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});
