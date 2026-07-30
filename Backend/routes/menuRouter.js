const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const menuController = require('../controllers/menuController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'food-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getAllMenuItems);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getMenuItemById);

// Add Product - Upload single image ('image' key in FormData)
router.post('/', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), menuController.createMenuItem);

// Update Product
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), menuController.updateMenuItem);

// Delete Product
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), menuController.deleteMenuItem);

module.exports = router;