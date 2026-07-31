import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use memory storage so we don't save files locally on the backend server
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
});

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private (Logged in users only)
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // Upload the file stream directly to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'rentx_properties' }, // This creates a neat folder in your Cloudinary dashboard
    (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: 'Image upload failed', error: error.message });
      }
      
      // Return the URL so the frontend can save it to MongoDB
      res.status(200).json({ 
        message: 'Image uploaded successfully',
        url: result.secure_url 
      });
    }
  );

  // Send the file buffer from RAM to Cloudinary
  uploadStream.end(req.file.buffer);
});

export default router;
