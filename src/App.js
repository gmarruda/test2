import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://api.gustavo.cc/test4', { text }, { responseType: 'blob' });
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error posting text:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Entre com o texto a ser falado:</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o texto aqui"
            required
          />
          <button type="submit">Enviar</button>
        </form>
        {audioUrl && (
          <div>
            <button onClick={() => new Audio(audioUrl).play()}>▶️ Play</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
