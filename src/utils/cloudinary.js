import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 
const uploadImage = async (path) => {
    if (!path) return null; 

    try {
        const res = await cloudinary.uploader.upload(path, { resource_type: "auto" });   

        return { url: res.secure_url }; 
    } catch (error) {
        return null;  
    } finally {
        await fs.unlink(path).catch(err => console.error("Failed to delete local file:", err)); 
    }
};

export { uploadImage };
