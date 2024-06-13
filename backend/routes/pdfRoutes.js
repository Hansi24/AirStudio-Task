const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDF = require('../models/PDF'); 
const { authenticateToken } = require('../middleware/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });

// Route for uploading PDF files
router.post('/upload', authenticateToken, upload.single('pdf'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const userId = req.user.user;
    const newPDF = new PDF({ name: filename, path, user: userId });
    await newPDF.save();
    res.status(201).json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

// Route for fetching list of uploaded PDF files
router.get('/files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user;
    const files = await PDF.find({user: userId});
    res.status(200).json({ success: true, files:files });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Error fetching files' });
  }
});

router.post('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user;
    console.log(userId)
    const deletedPDF = await PDF.findOneAndDelete({ _id: id, user: userId });

    if (!deletedPDF) {
      return res.status(404).json({ success: false, error: 'PDF not found' });
    }

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Failed to delete file' });
  }
});

module.exports = router;
