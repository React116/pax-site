const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware'); // Giriş yapmış kullanıcı kontrolü

// Tüm rotalar korumalıdır (sadece giriş yapanlar erişebilir)
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

module.exports = router;