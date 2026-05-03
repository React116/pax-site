const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/authMiddleware');
const { attachBusiness } = require('../middleware/businessOwnershipMiddleware');
const {
  listIntegrations,
  getIntegration,
  upsertIntegration,
  disconnectIntegration,
} = require('../controllers/integrationController');

router.use(protect, attachBusiness);

router.get('/',            listIntegrations);
router.get('/:channel',    getIntegration);
router.post('/:channel',   upsertIntegration);
router.delete('/:channel', disconnectIntegration);

module.exports = router;
