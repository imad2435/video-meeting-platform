# Simple Video Meeting Platform

A real-time video meeting application built with the MERN stack (MongoDB, Express, React, Node.js), Vite, and WebRTC for peer-to-peer communication. This project was developed as a technical assessment for Arivana.

## Features

-   **Create Meetings:** Generate a unique meeting ID to start a new session.
-   **Join Meetings:** Join an existing meeting using a valid meeting ID.
-   **Real-Time Video:** Peer-to-peer video streaming between connected clients.
-   **Signaling Server:** A Node.js and Socket.io server manages the WebRTC signaling (offers, answers, ICE candidates) to establish connections.
-   **Session Management:** The backend uses MongoDB to persist meeting information.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** React (with Vite)
-   **Database:** MongoDB (with Mongoose)
-   **Real-Time Engine:** Socket.io
-   **Peer-to-Peer Communication:** WebRTC

## Project Structure

The project is organized into two main directories:

-   `backend/`: Contains the Node.js/Express server, API routes, controllers, data models, and Socket.io logic.
-   `frontend/`: Contains the React client application built with Vite.

---

## Setup and Installation

### Prerequisites

-   Node.js and npm (or yarn)
-   MongoDB (a free MongoDB Atlas cluster is recommended)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add your environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ```

4.  **Start the backend server:**
    ```sh
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

---

## API Endpoints (REST)

-   `POST /api/meetings`
    -   Creates a new meeting and returns its details, including a unique `meetingId`.
-   `GET /api/meetings/:meetingId`
    -   Checks if a meeting with the given `meetingId` exists. Returns a 200 status if found, 404 if not found.

## Socket.io Events

The server facilitates WebRTC signaling using the following events:

-   `join-meeting`: A client sends this to join a specific meeting room.
-   `user-joined`: The server broadcasts this to existing clients in a room when a new user joins.
-   `offer`, `answer`, `ice-candidate`: These events are relayed between peers to negotiate and establish the WebRTC connection.

## Scalability and Future Improvements

-   **TURN Server:** For clients behind restrictive firewalls (NAT), a TURN server (like Coturn) could be integrated to relay media streams when a direct peer-to-peer connection is not possible.
-   **SFU (Selective Forwarding Unit):** For meetings with more than 3-4 participants, the current peer-to-peer (mesh) architecture becomes inefficient. Implementing an SFU like Mediasoup or LiveKit would significantly improve performance and reduce client-side load by having the server route video streams.
-   **Database Indexing:** Adding an index to the `meetingId` field in the MongoDB collection would improve the performance of `joinMeeting` lookups as the number of meetings grows.