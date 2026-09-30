import React from 'react';
import { 
  Sprout, 
  Users, 
  Briefcase, 
  Scale, 
  RotateCcw, 
  Globe, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function Navbar({ 
  currentRole, 
  onSelectRole, 
  lang, 
  onToggleLang, 
  onResetDemo, 
  isResetting 
}) {
  const t = translations[lang];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onSelectRole('farmer')}>
        <div className="brand-icon-wrapper">
          🌾
        </div>
        <div className="brand-text">
          <h1>KrishiMarg</h1>
          <span className="brand-tagline">
            {lang === 'hi' ? 'स्मार्ट कृषि लॉजिस्टिक्स एवं शुद्ध लाभ मंच' : 'Smart Agri-Logistics & Net Realization'}
          </span>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="role-tabs">
        <button 
          className={`role-tab ${currentRole === 'farmer' ? 'active' : ''}`}
          onClick={() => onSelectRole('farmer')}
        >
          <Sprout size={16} />
          <span>{t.farmerRole}</span>
        </button>

        <button 
          className={`role-tab ${currentRole === 'fpo' ? 'active' : ''}`}
          onClick={() => onSelectRole('fpo')}
        >
          <Users size={16} />
          <span>{t.fpoRole}</span>
        </button>

        <button 
          className={`role-tab ${currentRole === 'buyer' ? 'active' : ''}`}
          onClick={() => onSelectRole('buyer')}
        >
          <Briefcase size={16} />
          <span>{t.buyerRole}</span>
        </button>

        <button 
          className={`role-tab ${currentRole === 'judge' ? 'active judge-active' : ''}`}
          onClick={() => onSelectRole('judge')}
        >
          <Scale size={16} />
          <span>🧑⚖️ {t.judgeRole}</span>
        </button>
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        <button className="btn-lang-toggle" onClick={onToggleLang} title="Switch Language">
          <Globe size={14} />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        <button 
          className="btn-reset-demo" 
          onClick={onResetDemo}
          disabled={isResetting}
          title="Reset to factory demo data (LOT-TOM-001)"
        >
          <RotateCcw size={14} className={isResetting ? 'spin-anim' : ''} />
          <span>{isResetting ? 'Resetting...' : 'Reset Demo'}</span>
        </button>
      </div>
    </nav>
  );
}
