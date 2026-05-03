const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const { createLead, getLeads, getLeadStats } = require('../controllers/leadController');

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Bu saatte çok fazla form gönderimi. Lütfen daha sonra deneyin.' },
});

router.post('/',       leadLimiter, createLead);
router.get('/',        protect,     getLeads);
router.get('/stats',   protect,     getLeadStats);

module.exports = router;
