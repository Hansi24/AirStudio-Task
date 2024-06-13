const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDF = require('../models/PDF'); 

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to prevent overwriting
  }
});

const upload = multer({ storage });

// Route for uploading PDF files
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const newPDF = new PDF({ name: filename, path });
    await newPDF.save();
    res.status(201).json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

// Route for fetching list of uploaded PDF files
router.get('/files', async (req, res) => {
  try {
    const files = await PDF.find();
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Error fetching files' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PDF.findById(id);

    if (!pdf) {
      return res.status(404).json({ success: false, error: 'PDF not found' });
    }

    await pdf.remove();
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Failed to delete file' });
  }
});

module.exports = router;
