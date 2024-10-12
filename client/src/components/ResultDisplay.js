import React from 'react';
import '../App.css'
function ResultDisplay({ data }) {
  return (
    <div className="result-card">
      <p>{data.content}</p> {/* Render content as plain text */}
    </div>
  );
}

export default ResultDisplay;


