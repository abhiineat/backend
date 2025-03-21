import { asynchandle } from "../utils/asynchandler.js";
import { User } from "../models/user.js";
import { uploadImage } from "../utils/cloudinary.js";

const register = asynchandle(async (req, res) => {
    console.log("Uploaded Files:", req.files); // Debugging

    // Check if avatar is provided
    if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
        return res.status(400).json({ message: "Avatar is required" });
    }

    const avatarLocalPath = req.files.avatar[0].path; // ✅ Fix: Ensure correct assignment
    console.log("Avatar Local Path:", avatarLocalPath); // Debugging

    // Upload to Cloudinary
    const avatarUpload = await uploadImage(avatarLocalPath);
    console.log("Cloudinary Upload Response:", avatarUpload);

    if (!avatarUpload || !avatarUpload.url) {
        return res.status(500).json({ message: "Avatar upload failed" });
    }

    // Create user
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        password: req.body.password,
        avatar: avatarUpload.url // Store Cloudinary URL
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        return res.status(500).json({ message: "User creation failed" });
    }

    res.status(201).json({ message: "User created successfully", user: createdUser });
});

export { register };
