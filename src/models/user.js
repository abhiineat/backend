import mongoose ,{Schema}from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true  
    },
    avatar: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true,'password is required'],
    },

}, {timestamps: true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password);
}

export  const User = mongoose.model("User", userSchema);