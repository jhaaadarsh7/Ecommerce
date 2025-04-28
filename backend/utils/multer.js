const multer = require('multer');
const path = require('path');

// User avatar storage configuration
const userAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path for the avatars folder
    const avatarPath = path.join(__dirname, '..', 'uploads', 'avatars');
    cb(null, avatarPath);  // Folder to store user avatars
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique filename
  }
});

// Product image storage configuration
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path for the products folder
    const productPath = path.join(__dirname, '..', 'uploads', 'products');
    cb(null, productPath);  // Folder to store product images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique filename
  }
});

// Multer upload middleware for user avatar (single file)
const uploadUserAvatar = multer({
  storage: userAvatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('avatar');

// Multer upload middleware for multiple product images
const uploadProductImages = multer({
  storage: productImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit for each product image
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).array('images', 5); // Allow up to 5 images with the field name 'productImages'

module.exports = { uploadUserAvatar, uploadProductImages };
