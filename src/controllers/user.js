import { asynchandle } from "../utils/asynchandler.js";
import { User } from "../models/user.js";
import {uploadImage} from "../utils/cloudinary.js";
const register = asynchandle(async (req, res) => {
   const {username, email, fullname,password}=req.body 
    if(fullname.trim()===""){
        res.status(400).json({message:"fullname is required"})
    }
    if(username.trim()===""){
        res.status(400).json({message:"username is required"})
    }
    if(email.trim()===""){
        res.status(400).json({message:"email is required"})
    }
    const existedUser=User.findOne({
        $or:[
        {username},{email}
    ]
    })
    if(existedUser){
        res.status(409).json({message:"username or email already existed"})
    }
    const avatarLocalPath=req.files?.avatar[0].path ;
    if(!avatarLocalPath){
        res.status(400).json({message:"avatar is required"})
    }
    const avtar=await uploadImage(avatarLocalPath);
    if(!avtar){
        res.status(500).json({message:"avatar upload failed"})
    }
    const user=await User.create({
        username,email,fullname,password,avatar:avtar.url
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken" );
    if(!createdUser){
        res.status(500).json({message:"user creation failed"})
    }
    res.status(201).json({message:"user created successfully"})
}
);

export {register};