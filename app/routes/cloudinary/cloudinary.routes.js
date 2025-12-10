const express = require('express');
const multer = require('multer');
const { 
  getImage, 
  uploadImage, 
  deleteImage 
} = require('../../controllers/cloudinary/cloudinary.controller');

const router = express.Router();

// Multer lưu file vào bộ nhớ để upload qua stream
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ⚡ Dùng .array('images') để nhận nhiều file từ FE
router.post('/list', getImage);

router.post(
  '/upload',
  upload.array('images', 10),   // nhận tối đa 10 ảnh 1 lần
  uploadImage          // controller mới cho nhiều ảnh
);

router.delete('/delete', deleteImage);

module.exports = router;
