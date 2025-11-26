const express = require('express');
const router = express.Router();

// DÜZELTME: Klasörü taşıdığımız için yol artık '../models/controllers' DEĞİL,
// '../controllers' oldu. Doğru adres bu:
const { getProfile, updateProfile } = require('../controllers/businessController');

// Middleware dosyanın yerini kontrol et (Genelde middleware klasöründedir)
const { protect } = require('../middleware/authMiddleware');

// GET isteği: Profili getir
router.get('/', protect, getProfile);

// PUT isteği: Profili güncelle (Asistanı Aktif/Pasif yap)
router.put('/', protect, updateProfile);

module.exports = router;