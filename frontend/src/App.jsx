// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';

function App() {
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCreateMeeting = async () => {
    try {
      const response = await axios.post('/api/meetings');
      const newMeetingId = response.data.meetingId;
      alert(`New meeting created! ID: ${newMeetingId}`);
      setMeetingId(newMeetingId);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create a new meeting. Please try again.');
    }
  };

  const handleJoinMeeting = async () => {
    if (!meetingId) {
      alert('Please enter a meeting ID.');
      return;
    }
    try {
      await axios.get(`/api/meetings/${meetingId}`);
      // --- THIS IS THE CHANGE ---
      // Instead of an alert, navigate to the meeting room page
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Meeting not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="app-container">
      {/* ... the JSX is the same as before, no changes here ... */}
      <h1 className="title">Simple Video Meeting</h1>
      <div className="input-container">
        <input
          type="text"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value.trim())}
          placeholder="Enter Meeting ID"
        />
        <button onClick={handleJoinMeeting}>Join Meeting</button>
      </div>
      <div className="separator">
        <span>OR</span>
      </div>
      <button className="create-button" onClick={handleCreateMeeting}>
        Create New Meeting
      </button>
    </div>
  );
}

export default App;