import React from 'react';
import { useNavigate } from 'react-router-dom';
import './celebration.css'
export default function OpponentLeft() {
  const navigate = useNavigate();
  return (
    <div className="cel-container">
      <h1>Opponent Left the Match</h1>
      <h1>You Won! 🏆</h1>
      <p>Great job! 🎉</p>
      <button className="start-button" onClick={() => navigate('/')}>
        Start Game
      </button>
    </div>
  );
}
