// routes/meetingRoutes.js
const express = require('express');
const router = express.Router();
const { createMeeting, joinMeeting } = require('../controllers/meetingController');

// Route for creating a new meeting
router.post('/', createMeeting);

// Route for joining/checking a meeting
router.get('/:meetingId', joinMeeting);

module.exports = router;