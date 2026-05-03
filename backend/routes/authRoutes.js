const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Çok fazla deneme. Lütfen 15 dakika bekleyin.' },
});

router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);

module.exports = router;
