// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import MeetingRoom from './pages/MeetingRoom.jsx'; // Import our new page
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<App />} />
        {/* Route for the meeting room, with a dynamic meetingId parameter */}
        <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);