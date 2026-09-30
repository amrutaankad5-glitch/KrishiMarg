import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Edit3, 
  Mic, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function CropWizard({ 
  initialVoicePhrase, 
  onRegistered, 
  onCancel, 
  lang 
}) {
  const t = translations[lang];

  // Wizard state: 1: Crop, 2: Quantity, 3: When, 4: Quality, 5: WE UNDERSTOOD
  const [currentStep, setCurrentStep] = useState(1);
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(500);
  const [readyDate, setReadyDate] = useState('Next week');
  const [initialGrade, setInitialGrade] = useState('Grade A — Farmer Declared');
  const [generatedLotId, setGeneratedLotId] = useState('LOT-TOM-001');

  // If voice phrase passed in from home screen, parse and jump straight to WE UNDERSTOOD
  useEffect(() => {
    if (initialVoicePhrase) {
      // Auto-populate parsed values for demo phrase
      setCrop('Tomato');
      setQuantity(500);
      setReadyDate('Next week');
      setInitialGrade('Grade A — Farmer Declared');
      setGeneratedLotId('LOT-TOM-001');
      setCurrentStep(5); // Show WE UNDERSTOOD card directly
    }
  }, [initialVoicePhrase]);

  const cropOptions = [
    { id: 'Tomato', name: lang === 'hi' ? 'टमाटर (Tomato)' : 'Tomato', icon: '🍅' },
    { id: 'Potato', name: lang === 'hi' ? 'आलू (Potato)' : 'Potato', icon: '🥔' },
    { id: 'Onion', name: lang === 'hi' ? 'प्याज (Onion)' : 'Onion', icon: '🧅' }
  ];

  const readyOptions = [
    { id: 'Immediate', label: lang === 'hi' ? 'तुरंत (आज/कल)' : 'Immediate (Today/Tomorrow)' },
    { id: 'Next week', label: lang === 'hi' ? 'अगले हफ्ते' : 'Next week' },
    { id: 'In 2 weeks', label: lang === 'hi' ? '2 हफ्तों में' : 'In 2 weeks' }
  ];

  const gradeOptions = [
    { id: 'Grade A — Farmer Declared', label: lang === 'hi' ? 'ग्रेड A (उत्कृष्ट / Prime)' : 'Grade A — Prime Quality' },
    { id: 'Grade B — Farmer Declared', label: lang === 'hi' ? 'ग्रेड B (मध्यम / Medium)' : 'Grade B — Fair Quality' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate ID
      const prefix = crop.substring(0, 3).toUpperCase();
      setGeneratedLotId(`LOT-${prefix}-001`);
      setCurrentStep(5);
    }
  };

  const handleConfirm = () => {
    onRegistered({
      id: generatedLotId,
      crop,
      quantity: Number(quantity),
      readyDate,
      initialGrade,
      farmerName: 'Ramesh Patel',
      location: 'Khed Village, Pune'
    });
  };

  return (
    <div className="wizard-container">
      {/* Step Indicator (Steps 1 to 4) */}
      {currentStep <= 4 && (
        <div className="wizard-progress">
          <div className="wizard-progress-bar">
            <div 
              className="wizard-progress-fill"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step}
              className={`wizard-step-node ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              {currentStep > step ? <Check size={16} /> : step}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: What crop do you have? */}
      {currentStep === 1 && (
        <div>
          <div className="wizard-question-box">
            <h2>{t.qCrop}</h2>
            <p>{lang === 'hi' ? 'नीचे से अपनी फसल चुनें' : 'Select your produce from below'}</p>
          </div>

          <div className="crop-select-grid">
            {cropOptions.map(opt => (
              <button
                key={opt.id}
                className={`crop-option-btn ${crop === opt.id ? 'selected' : ''}`}
                onClick={() => setCrop(opt.id)}
              >
                <span className="crop-option-icon">{opt.icon}</span>
                <span>{opt.name}</span>
              </button>
            ))}
          </div>

          <div className="wizard-nav-btns">
            <button className="btn-wizard btn-edit" onClick={onCancel}>
              <ArrowLeft size={18} /> {lang === 'hi' ? 'वापस' : 'Back'}
            </button>
            <button className="btn-wizard btn-confirm" onClick={handleNext}>
              {lang === 'hi' ? 'आगे बढ़ें' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: How much? */}
      {currentStep === 2 && (
        <div>
          <div className="wizard-question-box">
            <h2>{t.qQty}</h2>
            <p>{lang === 'hi' ? 'मात्रा (किलोग्राम में)' : 'Quantity in kilograms'}</p>
          </div>

          <div className="quantity-input-wrapper">
            <div>
              <span className="quantity-display">{quantity}</span>
              <span className="quantity-unit">kg</span>
            </div>

            <input 
              type="range"
              min="100"
              max="2000"
              step="50"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '80%', accentColor: '#10b981', height: '8px' }}
            />

            <div className="qty-preset-chips">
              {[200, 300, 500, 1000, 1500].map(val => (
                <button
                  key={val}
                  className={`qty-chip ${quantity === val ? 'active' : ''}`}
                  onClick={() => setQuantity(val)}
                >
                  {val} kg
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-nav-btns">
            <button className="btn-wizard btn-edit" onClick={() => setCurrentStep(1)}>
              <ArrowLeft size={18} /> {lang === 'hi' ? 'पीछे' : 'Back'}
            </button>
            <button className="btn-wizard btn-confirm" onClick={handleNext}>
              {lang === 'hi' ? 'आगे बढ़ें' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: When will it be ready? */}
      {currentStep === 3 && (
        <div>
          <div className="wizard-question-box">
            <h2>{t.qWhen}</h2>
            <p>{lang === 'hi' ? 'फसल तुड़ाई या कटाई का समय' : 'Estimated harvesting or dispatch date'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {readyOptions.map(opt => (
              <button
                key={opt.id}
                className={`crop-option-btn ${readyDate === opt.id ? 'selected' : ''}`}
                style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '1.25rem' }}
                onClick={() => setReadyDate(opt.id)}
              >
                <Calendar size={24} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '1.15rem' }}>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="wizard-nav-btns">
            <button className="btn-wizard btn-edit" onClick={() => setCurrentStep(2)}>
              <ArrowLeft size={18} /> {lang === 'hi' ? 'पीछे' : 'Back'}
            </button>
            <button className="btn-wizard btn-confirm" onClick={handleNext}>
              {lang === 'hi' ? 'आगे बढ़ें' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: What is its quality? */}
      {currentStep === 4 && (
        <div>
          <div className="wizard-question-box">
            <h2>{t.qQuality}</h2>
            <p>{lang === 'hi' ? 'फसल की गुणवत्ता (किसान द्वारा घोषित)' : 'Farmer declared physical grade'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {gradeOptions.map(opt => (
              <button
                key={opt.id}
                className={`crop-option-btn ${initialGrade === opt.id ? 'selected' : ''}`}
                style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '1.25rem' }}
                onClick={() => setInitialGrade(opt.id)}
              >
                <Award size={24} style={{ color: '#f59e0b' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Checkpoint 1: FARMER DECLARED
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="wizard-nav-btns">
            <button className="btn-wizard btn-edit" onClick={() => setCurrentStep(3)}>
              <ArrowLeft size={18} /> {lang === 'hi' ? 'पीछे' : 'Back'}
            </button>
            <button className="btn-wizard btn-confirm" onClick={handleNext}>
              {lang === 'hi' ? 'समीक्षा करें' : 'Review'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: "WE UNDERSTOOD" Summary Card */}
      {currentStep === 5 && (
        <div>
          <div className="we-understood-card">
            <div className="we-understood-header">
              <Sparkles size={20} />
              <span>{t.weUnderstood}</span>
            </div>

            <div className="understood-lot-badge">
              {generatedLotId}
            </div>

            <div className="understood-details-list">
              <div className="understood-detail-item">
                <span className="understood-label">{lang === 'hi' ? 'फसल' : 'Crop'}</span>
                <span className="understood-val">🍅 {crop}</span>
              </div>
              <div className="understood-detail-item">
                <span className="understood-label">{lang === 'hi' ? 'मात्रा' : 'Quantity'}</span>
                <span className="understood-val">{quantity} kg</span>
              </div>
              <div className="understood-detail-item">
                <span className="understood-label">{lang === 'hi' ? 'तैयार समय' : 'Ready'}</span>
                <span className="understood-val">{readyDate}</span>
              </div>
              <div className="understood-detail-item">
                <span className="understood-label">{lang === 'hi' ? 'घोषित गुणवत्ता' : 'Grade'}</span>
                <span className="understood-val" style={{ color: '#34d399', fontSize: '1rem' }}>
                  {initialGrade}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge-tag badge-farmer-declared">
                FARMER DECLARED (CHECKPOINT 1)
              </span>
            </div>

            {/* Exact buttons requested in Prompt: CONFIRM, EDIT, SPEAK AGAIN */}
            <div className="wizard-nav-btns" style={{ flexWrap: 'wrap' }}>
              <button className="btn-wizard btn-confirm" onClick={handleConfirm}>
                <Check size={20} /> {t.confirm}
              </button>

              <button className="btn-wizard btn-edit" onClick={() => setCurrentStep(1)}>
                <Edit3 size={18} /> {t.edit}
              </button>

              <button 
                className="btn-wizard" 
                style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#fbbf24' }}
                onClick={() => {
                  setCurrentStep(1);
                  setCrop('Tomato');
                  setQuantity(500);
                }}
              >
                <Mic size={18} /> {t.speakAgain}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
