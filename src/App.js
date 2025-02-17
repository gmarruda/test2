import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://example.com/api', { name });
      setMessage(`Response: ${response.data.message}`);
    } catch (error) {
      console.error('Error posting name:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Enter Your Name</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;