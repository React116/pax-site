const express = require('express');
const router  = express.Router();
const { protect }         = require('../middleware/authMiddleware');
const { attachBusiness }  = require('../middleware/businessOwnershipMiddleware');
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailability,
} = require('../controllers/appointmentController');

router.use(protect, attachBusiness);

router.get('/availability',           getAvailability);   // önce — :id ile çakışmasın
router.get('/',                        getAppointments);
router.post('/',                       createAppointment);
router.put('/:appointmentId',          updateAppointment);
router.delete('/:appointmentId',       deleteAppointment);

module.exports = router;
