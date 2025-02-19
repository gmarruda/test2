import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (event) => {
    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
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
            <button onClick={handlePlayPause}>
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <div>
              <input
                type="range"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleProgressChange}
              />
              <div>
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <p style={{ textAlign: 'center' }}>{text}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
