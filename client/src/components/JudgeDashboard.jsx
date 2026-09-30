import React, { useState } from 'react';
import { 
  Scale, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  Calculator, 
  FileText,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function JudgeDashboard({ 
  lot, 
  buyers, 
  supplyChainData, 
  auditLogs, 
  onResetDemo,
  onTriggerStepAction
}) {
  const [activeTab, setActiveTab] = useState('tour'); // 'tour', 'supply_chain', 'calculations', 'feasibility', 'overselling', 'traceability'
  const [currentTourStep, setCurrentTourStep] = useState(1);

  // 18-step guided presentation tour specified in Requirement 23
  const tourSteps = [
    {
      step: 1,
      title: '1. Simple Farmer Crop Registration',
      category: 'Registration',
      summary: 'Extreme simplification: Asks 4 single questions (Crop, Quantity, Ready Date, Quality Grade).',
      insight: 'The farmer interface shields rural producers from cumbersome supply-chain ERP complexity.',
      actionButton: 'Inspect Registered Lot (LOT-TOM-001)',
      tabToOpen: 'tour'
    },
    {
      step: 2,
      title: '2. Native Voice Input Architecture',
      category: 'Accessibility',
      summary: 'Voice recognition for rural literacy: "I have 500 kilograms of tomato ready next week."',
      insight: 'Web Speech API with 1-tap demo preset generates a clean "WE UNDERSTOOD" confirmation card.',
      actionButton: 'View Understood Summary',
      tabToOpen: 'tour'
    },
    {
      step: 3,
      title: '3. Traditional Supply Chain Dissection',
      category: 'Supply Chain',
      summary: 'Farmer → Trader → Wholesaler → Distributor → Retailer.',
      insight: 'We do NOT say "remove middlemen". Each stage is evaluated on value added vs cost incurred.',
      actionButton: 'Open 5-Stage Supply Chain Table',
      tabToOpen: 'supply_chain'
    },
    {
      step: 4,
      title: '4. Value-Added vs Cost-Added Analysis',
      category: 'Supply Chain',
      summary: 'Classified: ESSENTIAL, POTENTIALLY DUPLICATIVE, HIGH COST, NEEDS VERIFICATION.',
      insight: 'Local traders aggregate physical volume and provide emergency liquidity; secondary re-handling adds 8-14% spoilage cost.',
      actionButton: 'Inspect Classifications',
      tabToOpen: 'supply_chain'
    },
    {
      step: 5,
      title: '5. The Physical Logistics Loophole',
      category: 'Logistics',
      summary: 'Digital routing does not mean physical movement is solved.',
      insight: 'KrishiMarg identifies who provides the vehicle, who loads, who transports, who unloads, and storage feasibility.',
      actionButton: 'Inspect Physical Handlers Matrix',
      tabToOpen: 'feasibility'
    },
    {
      step: 6,
      title: '6. 7-Point Logistics Feasibility Check',
      category: 'Feasibility Engine',
      summary: 'Checks: Buyer, Quantity, Quality, Pickup Timing, Transport, Storage, Delivery.',
      insight: 'Buyer C (Sahyadri Mega Exports @ ₹40/kg) is rejected: "No refrigerated transport available on this corridor."',
      actionButton: 'View 7-Point Feasibility Results',
      tabToOpen: 'feasibility'
    },
    {
      step: 7,
      title: '7. Multi-Route Comparison',
      category: 'Evaluation',
      summary: 'Side-by-side comparison of local retailer (Buyer A) vs regional wholesaler (Buyer B).',
      insight: 'Farmers see simple cards with plain language, while judges inspect full backend math.',
      actionButton: 'Compare Route A vs Route B',
      tabToOpen: 'calculations'
    },
    {
      step: 8,
      title: '8. Core Principle: ₹28 vs ₹26 Net Realization',
      category: 'Financial Core',
      summary: 'Buyer B offers ₹33/kg → Net ₹26/kg (₹13,000). Buyer A offers ₹30/kg → Net ₹28/kg (₹14,000).',
      insight: '“This buyer offers more, but transport and spoilage costs are higher.” This is the main value of KrishiMarg.',
      actionButton: 'View Cost Deductions Math',
      tabToOpen: 'calculations'
    },
    {
      step: 9,
      title: '9. Route Recommendation Scoring (86 vs 64)',
      category: 'Algorithm',
      summary: 'Weights: Net Realization 40%, Logistics 20%, Speed 15%, Reliability 15%, Spoilage 10%.',
      insight: 'Route A scores 86 / 100. Route B scores 64 / 100. Score is hidden from farmers to prevent clutter.',
      actionButton: 'Inspect 5 Scoring Weight Breakdown',
      tabToOpen: 'calculations'
    },
    {
      step: 10,
      title: '10. Buyer Reliability & Trust Tracking',
      category: 'Reputation',
      summary: 'Buyer A: 25 completed, same-day payment (🟢 Trusted). Buyer B: 2 completed (🟡 Limited history).',
      insight: 'Never falsely claim trust when transaction history is lacking.',
      actionButton: 'Inspect Buyer Directory',
      tabToOpen: 'calculations'
    },
    {
      step: 11,
      title: '11. Inventory Reservation & Anti-Overselling',
      category: 'Inventory Engine',
      summary: 'Farmer has 500 kg. If 300 kg reserved, only 200 kg available. Prevents double-booking.',
      insight: 'State machine locks inventory upon offer acceptance and safely rolls back on cancellation.',
      actionButton: 'Test Inventory Reservation & Rollback',
      tabToOpen: 'overselling'
    },
    {
      step: 12,
      title: '12. Farm Gate Pickup Verification',
      category: 'Physical Movement',
      summary: 'EcoVan 1.5T Mini-Truck arrives at Khed Farm #12.',
      insight: 'Farmer interface shows green ticks (✅ Pickup arranged, ✅ Vehicle available, ✅ Delivery possible).',
      actionButton: 'Verify Pickup Handlers',
      tabToOpen: 'feasibility'
    },
    {
      step: 13,
      title: '13. Checkpoint 2: Pickup Quality Inspection',
      category: 'Quality Drift',
      summary: 'Grade A verified at farm gate with 2% transit sorting damage noted.',
      insight: 'Recorded by EcoVan field partner before vehicle departure.',
      actionButton: 'View Checkpoint 2 Record',
      tabToOpen: 'traceability'
    },
    {
      step: 14,
      title: '14. Cold / Ventilated Transit Monitoring',
      category: 'Logistics',
      summary: '20 km corridor traveled in 55 minutes at 24°C monitored temperature.',
      insight: 'Reduces perishable spoilage to under 1% compared to traditional open highway transit (6-10%).',
      actionButton: 'View Transit Metrics',
      tabToOpen: 'traceability'
    },
    {
      step: 15,
      title: '15. Checkpoint 3: Delivery Quality Change',
      category: 'Quality Drift',
      summary: 'FreshMart dock logs Grade B (25 kg crushed in bottom crates during final handling).',
      insight: 'Quality change detected between farm gate and retail dock.',
      actionButton: 'Inspect Delivery Quality Audit',
      tabToOpen: 'traceability'
    },
    {
      step: 16,
      title: '16. Impartial Quality Review Banner',
      category: 'Dispute Prevention',
      summary: '⚠️ QUALITY CHANGE DETECTED — QUALITY REVIEW REQUIRED.',
      insight: 'KrishiMarg does NOT automatically blame the farmer, transporter, or buyer. Shows full history.',
      actionButton: 'View Discrepancy Protocol',
      tabToOpen: 'traceability'
    },
    {
      step: 17,
      title: '17. Honest Demo Payment Settlement',
      category: 'Settlement',
      summary: 'Expected: ₹14,000. Clearly labeled DEMO PAYMENT STATUS.',
      insight: 'Never fake real banking integrations or blockchain tokens. Clean deterministic settlement simulation.',
      actionButton: 'Verify Payment Status Badge',
      tabToOpen: 'overselling'
    },
    {
      step: 18,
      title: '18. Complete Digital Traceability Timeline',
      category: 'Audit Trail',
      summary: 'Farm → Collection → Transport → Buyer → Delivery.',
      insight: 'Every stage is stamped with RECORDED DEMO EVENT for judge inspection.',
      actionButton: 'Inspect Full Event Trace Log',
      tabToOpen: 'traceability'
    }
  ];

  const currentStepData = tourSteps[currentTourStep - 1];

  const handleNextStep = () => {
    if (currentTourStep < 18) {
      const next = currentTourStep + 1;
      setCurrentTourStep(next);
      setActiveTab(tourSteps[next - 1].tabToOpen);
    }
  };

  const handlePrevStep = () => {
    if (currentTourStep > 1) {
      const prev = currentTourStep - 1;
      setCurrentTourStep(prev);
      setActiveTab(tourSteps[prev - 1].tabToOpen);
    }
  };

  const jumpToStep = (stepNum) => {
    setCurrentTourStep(stepNum);
    setActiveTab(tourSteps[stepNum - 1].tabToOpen);
  };

  return (
    <div className="judge-container">
      {/* Interactive 18-Step Tour Control Header */}
      <div className="judge-tour-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem' }}>🧑⚖️</span>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>SIH Guided Evaluation Tour</h2>
            <span className="badge-tag badge-demo">STEP {currentTourStep} OF 18</span>
          </div>
          <p style={{ color: '#c7d2fe', fontSize: '0.9rem' }}>
            {currentStepData.title} • <span style={{ color: '#a5b4fc' }}>{currentStepData.category}</span>
          </p>
        </div>

        <div className="judge-tour-controls">
          <button 
            className="btn-tour-nav" 
            onClick={handlePrevStep}
            disabled={currentTourStep === 1}
            style={{ opacity: currentTourStep === 1 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> BACK
          </button>

          <button 
            className="btn-tour-nav" 
            onClick={handleNextStep}
            disabled={currentTourStep === 18}
            style={{ 
              background: '#4f46e5', 
              borderColor: '#6366f1',
              opacity: currentTourStep === 18 ? 0.4 : 1 
            }}
          >
            NEXT <ArrowRight size={16} />
          </button>

          <button 
            className="btn-tour-nav" 
            onClick={onResetDemo}
            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderColor: '#ef4444' }}
          >
            <RotateCcw size={14} /> RESET DEMO
          </button>
        </div>
      </div>

      {/* Current Step Highlight Banner */}
      <div style={{
        background: 'rgba(79, 70, 229, 0.12)',
        border: '1px solid #4f46e5',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '4px' }}>
            {currentStepData.summary}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#a5b4fc', fontStyle: 'italic' }}>
            «{currentStepData.insight}»
          </div>
        </div>

        <button 
          className="btn-wizard btn-confirm" 
          onClick={() => setActiveTab(currentStepData.tabToOpen)}
          style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
        >
          {currentStepData.actionButton}
        </button>
      </div>

      {/* Quick 18-Step Number Jumper */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {tourSteps.map(s => (
          <button
            key={s.step}
            onClick={() => jumpToStep(s.step)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: currentTourStep === s.step ? '#4f46e5' : 'rgba(255,255,255,0.05)',
              color: currentTourStep === s.step ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            #{s.step} {s.title.split('.')[1]?.trim()}
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="judge-tabs">
        <button 
          className={`judge-tab-btn ${activeTab === 'tour' ? 'active' : ''}`}
          onClick={() => setActiveTab('tour')}
        >
          🎯 Demo Tour Overview
        </button>

        <button 
          className={`judge-tab-btn ${activeTab === 'supply_chain' ? 'active' : ''}`}
          onClick={() => setActiveTab('supply_chain')}
        >
          ⛓️ Traditional Supply Chain (Value vs Cost)
        </button>

        <button 
          className={`judge-tab-btn ${activeTab === 'calculations' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculations')}
        >
          🧮 Math Breakdown (₹28 vs ₹26 & 86/100)
        </button>

        <button 
          className={`judge-tab-btn ${activeTab === 'feasibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('feasibility')}
        >
          🚚 7-Point Logistics Feasibility
        </button>

        <button 
          className={`judge-tab-btn ${activeTab === 'overselling' ? 'active' : ''}`}
          onClick={() => setActiveTab('overselling')}
        >
          🔒 Inventory Locks & Safe Cancellation
        </button>

        <button 
          className={`judge-tab-btn ${activeTab === 'traceability' ? 'active' : ''}`}
          onClick={() => setActiveTab('traceability')}
        >
          📜 Traceability & Quality Discrepancies
        </button>
      </div>

      {/* TAB CONTENT: SUPPLY CHAIN (Requirement 20) */}
      {activeTab === 'supply_chain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            fontSize: '0.92rem'
          }}>
            <strong style={{ color: '#34d399' }}>Core SIH Philosophy:</strong> We do NOT say "remove middlemen".
            We identify whether each supply-chain stage actually adds value and whether its cost is justified.
            Stages are classified into 4 distinct categories:
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className="classification-tag essential">ESSENTIAL</span>
              <span className="classification-tag potentially-duplicative">POTENTIALLY DUPLICATIVE</span>
              <span className="classification-tag high-cost">HIGH COST</span>
              <span className="classification-tag needs-verification">NEEDS VERIFICATION</span>
            </div>
          </div>

          <div className="supply-chain-table-card">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Stage & Operator</th>
                  <th>Service Provided</th>
                  <th>Price at Stage</th>
                  <th>Direct Cost</th>
                  <th>Time Spent</th>
                  <th>Value Added & Classification</th>
                </tr>
              </thead>
              <tbody>
                {supplyChainData?.map(stage => (
                  <tr key={stage.stageNumber}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                        {stage.stageNumber}. {stage.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {stage.operator}
                      </div>
                    </td>
                    <td>{stage.serviceProvided}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{stage.priceAtStage}</td>
                    <td style={{ color: '#fbbf24' }}>{stage.directCostIncurred}</td>
                    <td>{stage.timeSpent}</td>
                    <td>
                      <div style={{ marginBottom: '6px' }}>
                        <span className={`classification-tag ${stage.classification.toLowerCase().replace(/_/g, '-')}`}>
                          {stage.classification}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {stage.classificationDetail}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CALCULATIONS (Requirement 5 & 7) */}
      {activeTab === 'calculations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Formula Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Deterministic Net Realization Math</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Formula executed in backend engine:
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'monospace',
              fontSize: '1.15rem',
              color: '#34d399',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              Net Realization = Buyer Offer − Transport − Handling − Storage − Packaging − Spoilage
            </div>

            {/* Side by Side Math Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Buyer A */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: '#34d399' }}>Route A (FreshMart Retail)</h4>
                  <span className="badge-tag badge-trusted">SCORE: 86 / 100</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nominal Offer:</span>
                    <strong>₹30.00/kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                    <span>- Transport (20 km):</span>
                    <span>₹1.00/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                    <span>- Handling & Crates:</span>
                    <span>₹0.40/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                    <span>- Storage (Direct):</span>
                    <span>₹0.00/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                    <span>- Packaging:</span>
                    <span>₹0.30/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Spoilage (1% short transit):</span>
                    <span>₹0.30/kg</span>
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#34d399' }}>
                    <span>= True Net Realization:</span>
                    <strong>₹28.00/kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>500 kg Take-Home:</span>
                    <span style={{ color: '#34d399' }}>₹14,000</span>
                  </div>
                </div>
              </div>

              {/* Buyer B */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid #f59e0b',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: '#fbbf24' }}>Route B (Metro Agro Wholesaler)</h4>
                  <span className="badge-tag badge-limited">SCORE: 64 / 100</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nominal Offer:</span>
                    <strong style={{ color: '#fbbf24' }}>₹33.00/kg (Higher Nominal!)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Transport (150 km highway):</span>
                    <span>₹3.50/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Handling & Porter Union:</span>
                    <span>₹1.20/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Transit Holding Storage:</span>
                    <span>₹0.80/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Packaging / Crating:</span>
                    <span>₹0.50/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}>
                    <span>- Spoilage (3.5% decay over 3-day delay):</span>
                    <span>₹1.00/kg</span>
                  </div>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#fbbf24' }}>
                    <span>= True Net Realization:</span>
                    <strong>₹26.00/kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                    <span>500 kg Take-Home:</span>
                    <span style={{ color: '#fbbf24' }}>₹13,000 (₹1,000 Less!)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FEASIBILITY (Requirement 4 & 6) */}
      {activeTab === 'feasibility' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>7-Point Logistics Feasibility Checklist</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Before KrishiMarg recommends any buyer, the feasibility engine validates all 7 constraints:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              {buyers.map(b => (
                <div 
                  key={b.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: b.logistics.feasible ? '1px solid #10b981' : '1px solid #ef4444',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{b.name}</strong>
                    <span className={`badge-tag ${b.logistics.feasible ? 'badge-trusted' : 'badge-needs-verification'}`}>
                      {b.logistics.feasible ? 'FEASIBLE' : 'INFEASIBLE'}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                    <li style={{ color: '#34d399' }}>✓ Buyer Available</li>
                    <li style={{ color: '#34d399' }}>✓ Quantity 500 kg Matched</li>
                    <li style={{ color: '#34d399' }}>✓ Grade A Compatible</li>
                    <li style={{ color: b.pickupDelayHours <= 96 ? '#34d399' : '#f87171' }}>
                      {b.pickupDelayHours <= 96 ? '✓' : '✗'} Timing: {b.pickupTiming}
                    </li>
                    <li style={{ color: b.logistics.feasible ? '#34d399' : '#f87171' }}>
                      {b.logistics.feasible ? '✓' : '✗'} Transport: {b.logistics.whoProvidesVehicle}
                    </li>
                    <li style={{ color: b.logistics.storageAvailable || !b.logistics.storageNeeded ? '#34d399' : '#f87171' }}>
                      {b.logistics.storageAvailable || !b.logistics.storageNeeded ? '✓' : '✗'} Storage Verified
                    </li>
                    <li style={{ color: b.logistics.feasible ? '#34d399' : '#f87171' }}>
                      {b.logistics.feasible ? '✓' : '✗'} Delivery Dock Confirmed
                    </li>
                  </ul>

                  {!b.logistics.feasible && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#fca5a5', background: 'rgba(239,68,68,0.1)', padding: '6px', borderRadius: '4px' }}>
                      Blocked: {b.logistics.infeasibilityReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OVERSELLING & CANCELLATION (Requirement 11 & 14) */}
      {activeTab === 'overselling' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Inventory Reservation & Rollback State Machine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Real-time balance tracking prevents overselling. A 500 kg lot with 300 kg reserved only exposes 200 kg.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL REGISTERED LOT</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{lot.quantity} kg</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {lot.id}</span>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #f59e0b' }}>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>RESERVED QUANTITY (LOCKED)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{lot.reservedQuantity} kg</div>
                <span style={{ fontSize: '0.8rem', color: '#fef3c7' }}>Buyer: {lot.assignedBuyerId || 'None'}</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '0.8rem', color: '#34d399' }}>AVAILABLE TO NEW BUYERS</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{lot.availableQuantity} kg</div>
                <span style={{ fontSize: '0.8rem', color: '#d1fae5' }}>Anti-overselling active</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Current Order Status & Settlement State</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lifecycle Stage:</div>
                  <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{lot.currentStage}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Payment Audit:</div>
                  <span className="badge-tag badge-demo">{lot.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRACEABILITY & CHECKPOINTS (Requirement 10 & 16) */}
      {activeTab === 'traceability' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Physical Quality Checkpoints & Traceability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Full audit trail stamped with RECORDED DEMO EVENT tags:
            </p>

            <div className="trace-timeline">
              {lot.traceabilityEvents?.map((evt, idx) => (
                <div key={evt.id || idx} className="trace-event-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{evt.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{evt.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '4px' }}>
                    Actor: {evt.actor} • Location: {evt.location}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {evt.details}
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <span className="badge-tag badge-recorded-event">RECORDED DEMO EVENT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TOUR SUMMARY (DEFAULT) */}
      {activeTab === 'tour' && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>18-Step SIH Evaluation Map</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click any step to inspect the underlying calculation, logistics matrix, or traceability log:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {tourSteps.map(s => (
              <div 
                key={s.step}
                onClick={() => jumpToStep(s.step)}
                style={{
                  background: currentTourStep === s.step ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: currentTourStep === s.step ? '2px solid #4f46e5' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1.05rem', color: currentTourStep === s.step ? '#818cf8' : 'white' }}>
                    {s.title}
                  </strong>
                  <span className="badge-tag badge-demo">{s.category}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {s.summary}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontStyle: 'italic' }}>
                  {s.insight}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
