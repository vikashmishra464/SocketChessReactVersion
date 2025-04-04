import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Winner() {
  const navigate = useNavigate();
  return (
    <div className="cel-container">
      <h1>You Lost 😢</h1>
      <p>Don't worry, try again!</p>
      <button className="start-button" onClick={() => navigate('/')}>
        Start Game
      </button>
    </div>
  );
}
