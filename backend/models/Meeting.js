// models/Meeting.js
const mongoose = require('mongoose');

// Define the schema for the Meeting model
const meetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
    unique: true, // Each meeting must have a unique ID
  },
  // We can add more fields later, like participants, etc.
}, {
  // The timestamps option automatically adds createdAt and updatedAt fields
  timestamps: true,
});

// Create the Meeting model from the schema
const Meeting = mongoose.model('Meeting', meetingSchema);

// Export the model so we can use it in other parts of our application
module.exports = Meeting;