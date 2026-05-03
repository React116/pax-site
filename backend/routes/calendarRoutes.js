const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/calendarController');

const calendarLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { message: 'İstek limiti aşıldı.' },
});

router.use(protect, calendarLimiter);

router.get('/',       getEvents);
router.post('/',      createEvent);
router.put('/:id',    updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
