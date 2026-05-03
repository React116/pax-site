const express = require('express');
const router  = express.Router();
const {
  telegramVerify,
  telegramWebhook,
  whatsappVerify,
  whatsappWebhook,
  viberWebhook,
} = require('../controllers/webhookController');

// Telegram
router.get('/telegram/:businessId',  telegramVerify);
router.post('/telegram/:businessId', telegramWebhook);

// WhatsApp (Meta)
router.get('/whatsapp/:businessId',  whatsappVerify);
router.post('/whatsapp/:businessId', whatsappWebhook);

// Viber
router.post('/viber/:businessId', viberWebhook);

module.exports = router;
