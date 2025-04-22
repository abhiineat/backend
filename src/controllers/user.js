import { asynchandle } from "../utils/asynchandler.js";
import { User } from "../models/user.js";
import { uploadImage } from "../utils/cloudinary.js";

// Register
const register = asynchandle(async (req, res) => {
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
        return res.status(400).json({
            message: "Username, email, fullname, and password are required",
        });
    }

    if (!req.files?.avatar?.[0]) {
        return res.status(400).json({ message: "Avatar is required" });
    }

    const avatarLocalPath = req.files.avatar[0].path;
    const avatarUpload = await uploadImage(avatarLocalPath);

    if (!avatarUpload?.url) {
        return res.status(500).json({ message: "Avatar upload failed" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatarUpload.url,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        return res.status(500).json({ message: "User creation failed" });
    }

    res.status(201).json({ message: "User created successfully", user: createdUser });
});

// Login
const login = asynchandle(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" });
    }

    // IMPORTANT: select("+password") if password is excluded by default
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
        return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User logged in successfully",
            user: loggedInUser,
            accessToken,
            refreshToken,
        });
});

// Logout
const logout = asynchandle(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { refreshToken: undefined },
        { new: true, runValidators: true }
    );

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ message: "Logged out successfully" });
});

export { register, login, logout };
