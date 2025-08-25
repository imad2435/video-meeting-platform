import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// A dedicated component for rendering a remote video stream
const RemoteVideo = ({ stream }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay playsInline />;
};

function MeetingRoom() {
  const { meetingId } = useParams();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const localStreamRef = useRef(null); // <-- Use a ref to hold the stream

  useEffect(() => {
    const socket = io('http://localhost:5000');

    const createPeerConnection = (targetSocketId, isInitiator, offer) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionsRef.current[targetSocketId] = pc;

      // Add local stream tracks from the ref
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
      }

      pc.ontrack = (event) => {
        setRemoteStreams(prev => {
          if (!prev.some(s => s.id === targetSocketId)) {
            return [...prev, { id: targetSocketId, stream: event.streams[0] }];
          }
          return prev;
        });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { target: targetSocketId, candidate: event.candidate });
        }
      };

      if (isInitiator) {
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit('offer', { target: targetSocketId, from: socket.id, offer: pc.localDescription });
          });
      } else {
        pc.setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => pc.createAnswer())
          .then(answer => pc.setLocalDescription(answer))
          .then(() => {
            socket.emit('answer', { target: targetSocketId, from: socket.id, answer: pc.localDescription });
          });
      }
    };

    socket.on('user-joined', ({ socketId }) => createPeerConnection(socketId, true));
    socket.on('offer', ({ from, offer }) => createPeerConnection(from, false, offer));
    socket.on('answer', ({ from, answer }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
    socket.on('ice-candidate', ({ from, candidate }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
    socket.on('user-left', ({ socketId }) => {
      if (peerConnectionsRef.current[socketId]) {
        peerConnectionsRef.current[socketId].close();
        delete peerConnectionsRef.current[socketId];
      }
      setRemoteStreams(prev => prev.filter(s => s.id !== socketId));
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream; // <-- Store stream in ref
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        socket.emit('join-meeting', meetingId);
      })
      .catch(err => console.error('Error accessing media devices.', err));

    return () => {
      socket.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    };
  }, [meetingId]); // <-- THE DEPENDENCY ARRAY IS NOW CORRECT

  return (
    <div>
      <h1>Meeting Room</h1>
      <p>Meeting ID: {meetingId}</p>
      <div className="video-container">
        <div>
          <h3>You</h3>
          <video ref={localVideoRef} autoPlay muted playsInline />
        </div>
        {remoteStreams.map(({ id, stream }) => (
          <div key={id}>
            <h3>Remote User</h3>
            <RemoteVideo stream={stream} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeetingRoom;