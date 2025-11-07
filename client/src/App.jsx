import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Use relative API URL when running on same server, or absolute URL for development
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '/api');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition if available
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN,en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start voice input
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported in your browser. Please use Chrome or Edge.');
    }
  };

  // Stop voice input
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Play audio response
  const playAudio = (audioData) => {
    if (audioData && audioRef.current) {
      audioRef.current.src = audioData;
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  };

  // Update memory (keep last 3 interactions)
  const updateMemory = (userText, aiResponse) => {
    const newMemory = [
      ...memory,
      {
        when: new Date().toISOString(),
        key: 'last_user_message',
        value: userText.substring(0, 50)
      },
      {
        when: new Date().toISOString(),
        key: 'last_ai_response',
        value: aiResponse.substring(0, 50)
      }
    ].slice(-6); // Keep last 3 interactions (2 items each)
    
    setMemory(newMemory);
    return newMemory;
  };

  // Send message to backend
  const handleSend = async (text = inputText) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message to UI
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Build API URL correctly - if API_URL is relative (starts with /), use it directly, otherwise append /api
      const apiEndpoint = API_URL.startsWith('/') ? `${API_URL}/chat` : `${API_URL}/api/chat`;
      const response = await axios.post(apiEndpoint, {
        text: userMessage,
        memory: memory
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data.text,
        fallbackText: response.data.fallbackText,
        audio: response.data.audio,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update memory
      updateMemory(userMessage, response.data.text);

      // Play audio if available
      if (response.data.audio) {
        playAudio(response.data.audio);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, main abhi thoda busy hoon. Thodi der baad try karein?',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="avatar">🌊</div>
          <div>
            <h1>Miss Riverwood</h1>
            <p>Riverwood Projects LLP - AI Voice Agent</p>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <p>Namaste! 👋</p>
              <p>Main Miss Riverwood hoon - Riverwood Projects LLP ki AI assistant. Aap kaise hain?</p>
              <p>Main aapki madad kar sakti hoon site visit schedule karne mein, construction updates dene mein, ya kisi bhi sawaal ke liye. Boliye, kaise madad kar sakti hoon?</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                {message.fallbackText && message.fallbackText !== message.text && (
                  <p className="fallback-text">{message.fallbackText}</p>
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice input..."
              disabled={isLoading}
            />
            <div className="input-actions">
              {isListening ? (
                <button
                  className="voice-btn listening"
                  onClick={stopListening}
                  title="Stop listening"
                >
                  🎤
                </button>
              ) : (
                <button
                  className="voice-btn"
                  onClick={startListening}
                  disabled={isLoading}
                  title="Start voice input"
                >
                  🎙️
                </button>
              )}
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={isLoading || !inputText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} />
    </div>
  );
}

export default App;

