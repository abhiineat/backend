import { asynchandle } from "../utils/asynchandler.js";
import { User } from "../models/user.js";
import { uploadImage } from "../utils/cloudinary.js";

const register = asynchandle(async (req, res) => {
    if (!req.files?.avatar?.[0]) {
        return res.status(400).json({ message: "Avatar is required" });
    }

    const avatarLocalPath = req.files.avatar[0].path;
    const avatarUpload = await uploadImage(avatarLocalPath);

    if (!avatarUpload?.url) {
        return res.status(500).json({ message: "Avatar upload failed" });
    }
    if(!req.body.password){
        return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        password: req.body.password,
        avatar: avatarUpload.url
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        return res.status(500).json({ message: "User creation failed" });
    }

    res.status(201).json({ message: "User created successfully", user: createdUser });
});




export { register };
