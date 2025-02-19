import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAudioUrl(null);
    try {
      const response = await axios.post('https://api.gustavo.cc/tts', { text }, { responseType: 'blob' });
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setText('');
    } catch (error) {
      console.error('Error posting text:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', () => {
        audioElement.currentTime = 0;
      });
    }
  }, []);

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
        {loading && <p>Loading...</p>}
        {audioUrl && (
          <div>
            <audio ref={audioRef} src={audioUrl} />
            <button onClick={handlePlay}>▶️ Play</button>
            <p style={{ textAlign: 'center' }}>{text}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
