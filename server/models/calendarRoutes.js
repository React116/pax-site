const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');
const authMiddleware = require('../middleware/authMiddleware');

// Get Events
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userId: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add Event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newEvent = new CalendarEvent({ ...req.body, userId: req.user.id });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete Event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await CalendarEvent.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;