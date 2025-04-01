import React from 'react';
import { useNavigate } from 'react-router-dom';
import './entrypage.css';

export default function EntryPage() {
  const navigate = useNavigate();
  return (
    <div className="entry-container">
      <h1 className="entry-title">Welcome to Socket Chess</h1>
      <p className="entry-subtitle">Play online chess with real-time socket connections.</p>
      <button className="start-button" onClick={() => navigate('/play')}>
        Start Game
      </button>
    </div>
  );
}
