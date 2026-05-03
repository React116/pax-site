const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { attachBusiness } = require('../middleware/businessOwnershipMiddleware');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');

// Tüm route'lar: önce JWT doğrula, sonra işletmeyi bağla
router.use(protect, attachBusiness);

router.get('/',                  getServices);
router.post('/',                 createService);
router.put('/:serviceId',        updateService);
router.delete('/:serviceId',     deleteService);

module.exports = router;
