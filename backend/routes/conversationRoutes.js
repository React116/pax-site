const express = require('express');
const router  = express.Router();
const { protect }        = require('../middleware/authMiddleware');
const { attachBusiness } = require('../middleware/businessOwnershipMiddleware');
const {
  getConversations,
  getConversation,
  createConversation,
  updateStatus,
  sendMessage,
  deleteConversation,
} = require('../controllers/conversationController');

router.use(protect, attachBusiness);

router.get('/',                                    getConversations);
router.post('/',                                   createConversation);
router.get('/:conversationId',                     getConversation);
router.put('/:conversationId/status',              updateStatus);
router.post('/:conversationId/messages',           sendMessage);
router.delete('/:conversationId',                  deleteConversation);

module.exports = router;
