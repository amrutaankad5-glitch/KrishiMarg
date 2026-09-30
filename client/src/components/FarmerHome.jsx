import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  TrendingUp, 
  Package, 
  HelpCircle, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function FarmerHome({ 
  onActionSelect, 
  onVoiceDetected, 
  lang,
  activeLot 
}) {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // Web Speech API handler + fallback
  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: trigger demo preset phrase directly
      triggerDemoPhrase();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        setIsListening(false);
        onVoiceDetected(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        triggerDemoPhrase();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      triggerDemoPhrase();
    }
  };

  const triggerDemoPhrase = () => {
    const phrase = lang === 'hi'
      ? 'मेरे पास अगले हफ्ते के लिए 500 किलो टमाटर तैयार हैं।'
      : 'I have 500 kilograms of tomato ready next week.';
    setVoiceText(phrase);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      onVoiceDetected(phrase);
    }, 800);
  };

  return (
    <div className="farmer-home">
      {/* Welcome Bar */}
      <div className="farmer-welcome-bar">
        <div>
          <h2>{t.welcomeFarmer} 🌾</h2>
          <p>{t.welcomeSub}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge-tag badge-farmer-declared">
            👤 {activeLot?.farmerName || 'Ramesh Patel'}
          </span>
          <span className="badge-tag badge-demo">DEMO DATA</span>
        </div>
      </div>

      {/* Voice Hero Section */}
      <div className="voice-hero-card">
        <button 
          className={`mic-pulse-btn ${isListening ? 'listening' : ''}`}
          onClick={handleStartListening}
          aria-label={t.speakPrompt}
          title="Click to speak"
        >
          {isListening ? <MicOff size={36} /> : <Mic size={36} />}
        </button>

        <div>
          <div className="voice-status-text">
            {isListening ? t.listening : `🎙️ ${t.speakPrompt}`}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            {lang === 'hi' 
              ? 'सिर्फ बोलें: "मेरे पास अगले हफ्ते के लिए 500 किलो टमाटर तैयार हैं"' 
              : 'Simply say: "I have 500 kilograms of tomato ready next week."'}
          </p>
        </div>

        {/* Quick Demo Voice Pill for reliable 1-click live demo */}
        <button 
          className="voice-sample-pill"
          onClick={triggerDemoPhrase}
          title="Click for instant 1-tap voice demo"
        >
          <Volume2 size={16} />
          <span>{t.sampleVoiceBtn}</span>
        </button>

        {voiceText && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            fontSize: '0.95rem',
            color: '#a7f3d0'
          }}>
            🗣️ "{voiceText}"
          </div>
        )}
      </div>

      {/* 4 Large Action Cards (2x2 Grid) */}
      <div className="farmer-grid">
        {/* 1. Sell My Crop */}
        <button 
          className="farmer-action-card sell-card"
          onClick={() => onActionSelect('sell')}
        >
          <div className="action-card-icon">
            🌾
          </div>
          <div className="action-card-content">
            <h3>{t.sellCrop}</h3>
            <p>{t.sellCropDesc}</p>
          </div>
          <ArrowRight size={24} style={{ marginLeft: 'auto', color: '#10b981' }} />
        </button>

        {/* 2. Track My Crop */}
        <button 
          className="farmer-action-card track-card"
          onClick={() => onActionSelect('track')}
        >
          <div className="action-card-icon">
            📦
          </div>
          <div className="action-card-content">
            <h3>{t.trackCrop}</h3>
            <p>{t.trackCropDesc}</p>
          </div>
          <ArrowRight size={24} style={{ marginLeft: 'auto', color: '#3b82f6' }} />
        </button>

        {/* 3. My Expected Earnings */}
        <button 
          className="farmer-action-card earnings-card"
          onClick={() => onActionSelect('earnings')}
        >
          <div className="action-card-icon">
            💰
          </div>
          <div className="action-card-content">
            <h3>{t.myEarnings}</h3>
            <p>{t.myEarningsDesc}</p>
          </div>
          <ArrowRight size={24} style={{ marginLeft: 'auto', color: '#f59e0b' }} />
        </button>

        {/* 4. Get Help from FPO/CSC */}
        <button 
          className="farmer-action-card fpo-card"
          onClick={() => onActionSelect('fpo_help')}
        >
          <div className="action-card-icon">
            🤝
          </div>
          <div className="action-card-content">
            <h3>{t.fpoHelp}</h3>
            <p>{t.fpoHelpDesc}</p>
          </div>
          <ArrowRight size={24} style={{ marginLeft: 'auto', color: '#8b5cf6' }} />
        </button>
      </div>
    </div>
  );
}
