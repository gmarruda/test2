import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState(''); // New state for displaying text
  const audioRef = useRef(null);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAudioUrl(null);
    try {
      const response = await axios.post(apiEndpoint, { text }, {
        responseType: 'blob',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });
      const audioBlob = new Blob([response.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setDisplayText(text); // Set the display text
      setText(''); // Clear the input text box
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
            <p style={{ textAlign: 'center' }}>{displayText}</p> {/* Display the text */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
