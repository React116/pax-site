const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { attachBusiness } = require('../middleware/businessOwnershipMiddleware');
const { getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');

router.use(protect, attachBusiness);

router.get('/',              getStaff);
router.post('/',             createStaff);
router.put('/:staffId',      updateStaff);
router.delete('/:staffId',   deleteStaff);

module.exports = router;
