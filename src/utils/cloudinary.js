import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 
const uploadImage = async (path) => {
    try {
        if (!path) return
        const res = await cloudinary.uploader.upload(path, { resource_type: "auto" });   
        console.log("file is uploaded to cloudinary");
        return res.url;
    }
    catch (error) {
        fs.unlinkSync(path);
        console.log(error);
    }
}

export {uploadImage}