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

        return { url: res.secure_url }; // ✅ Always return an object
    } catch (error) {
        return null;  // Return `null` instead of undefined
    } finally {
        await fs.unlink(path).catch(err => console.error("Failed to delete local file:", err)); // ✅ Always delete the local file
    }
};

export { uploadImage };
