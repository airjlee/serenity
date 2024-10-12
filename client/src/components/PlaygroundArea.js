import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

function PlaygroundArea() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    if(prompt)
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/generate/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="playground">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="post (patient name) (operation)" 
        />
        <button type="submit">Generate</button>
      </form>
      <div className="results-area">
        {results.length > 0 ? (
          results.map((result, index) => (
            <ResultDisplay key={index} data={result} />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default PlaygroundArea;
