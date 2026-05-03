const express = require('express');
const router  = express.Router();
const { protect }        = require('../middleware/authMiddleware');
const { attachBusiness } = require('../middleware/businessOwnershipMiddleware');
const { businessReply, testReply, updateAISettings, getAISettings } = require('../controllers/aiController');

router.use(protect, attachBusiness);

router.get('/settings',    getAISettings);
router.put('/settings',    updateAISettings);
router.post('/test-reply', testReply);
router.post('/business-reply', businessReply);

module.exports = router;
