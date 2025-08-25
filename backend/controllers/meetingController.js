// controllers/meetingController.js
const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid'); // We'll need to install this package

// @desc    Create a new meeting
// @route   POST /api/meetings
// @access  Public
const createMeeting = async (req, res) => {
  try {
    // Generate a unique meeting ID
    const meetingId = uuidv4();

    // Create a new meeting document in the database
    const meeting = await Meeting.create({
      meetingId,
    });

    res.status(201).json(meeting); // Send the new meeting details back
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check if a meeting exists (for joining)
// @route   GET /api/meetings/:meetingId
// @access  Public
const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params; // Get meetingId from the URL

    // Find the meeting in the database
    const meeting = await Meeting.findOne({ meetingId });

    if (meeting) {
      res.status(200).json({ message: 'Meeting found', meeting });
    } else {
      res.status(404).json({ message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createMeeting,
  joinMeeting,
};