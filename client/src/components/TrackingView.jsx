import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  RotateCcw, 
  ShieldAlert, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function TrackingView({ 
  lot, 
  onCancelOrder, 
  onSimulateStage, 
  onAddQualityCheckpoint,
  onSearchAlternatives,
  lang 
}) {
  const t = translations[lang];
  const [showTraceModal, setShowTraceModal] = useState(false);

  // 7 simple farmer stages
  const farmerSteps = [
    { key: 'OFFER_ACCEPTED', name: t.stepOfferAccepted, icon: '🤝' },
    { key: 'PICKUP_SCHEDULED', name: t.stepPickupScheduled, icon: '📅' },
    { key: 'PICKUP', name: t.stepPickup, icon: '📦' },
    { key: 'IN_TRANSIT', name: t.stepInTransit, icon: '🚚' },
    { key: 'DELIVERED', name: t.stepDelivered, icon: '🏁' },
    { key: 'QUALITY_CHECK', name: t.stepQualityCheck, icon: '🔍' },
    { key: 'PAYMENT', name: t.stepPayment, icon: '💰' }
  ];

  // Map backend stages to farmer step index
  const stageToIndex = {
    'REGISTERED': -1,
    'BUYER_OFFER': 0,
    'OFFER_ACCEPTED': 0,
    'INVENTORY_RESERVED': 0,
    'PICKUP_SCHEDULED': 1,
    'PICKUP_COMPLETED': 2,
    'IN_TRANSIT': 3,
    'DELIVERED': 4,
    'QUALITY_REVIEW': 5,
    'PAYMENT_PENDING': 5,
    'COMPLETED': 6,
    'PAYMENT_COMPLETED': 6,
    'CANCELLED': -2
  };

  const currentStepIdx = stageToIndex[lot.currentStage] ?? 0;
  const isCancelled = lot.currentStage === 'CANCELLED';

  // Check if quality changed to Grade B or discrepancy exists (Requirement 10)
  const hasQualityDiscrepancy = lot.checkpoints?.some(
    chk => chk.stage === 'DELIVERY' && chk.declaredGrade === 'Grade B'
  ) || lot.currentStage === 'QUALITY_REVIEW';

  const isPaid = lot.paymentStatus?.includes('Completed') || lot.currentStage === 'COMPLETED';

  return (
    <div className="tracking-view">
      {/* Top Header Card */}
      <div className="tracking-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Tracking Lot: {lot.id}
            </span>
            <span className="badge-tag badge-demo">DEMO TRACKER</span>
            <span className="badge-tag badge-farmer-declared">{lot.crop} • {lot.quantity} kg</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Partner Buyer: <strong>{lot.acceptedOffer?.buyerName || 'FreshMart Retail Hub'}</strong> | 
            Pickup Vehicle: <strong>EcoVan (MH-12-Q-4491)</strong>
          </p>
        </div>

        {/* Expected Payment Box (Requirement 15) */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.25rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {t.expectedPayment}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
            ₹14,000
          </div>
          <span className="badge-tag badge-demo" style={{ fontSize: '0.68rem' }}>
            {isPaid ? t.paymentCompleted : t.paymentPending}
          </span>
        </div>
      </div>

      {/* CANCELLATION NOTICE (Requirement 14) */}
      {isCancelled ? (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid #ef4444',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', color: '#fca5a5', marginBottom: '0.5rem' }}>
            ⚠️ Buyer cancelled this order.
          </h2>
          <p style={{ color: '#fecaca', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            KrishiMarg automated rollback has successfully <strong>released 500 kg</strong> back into your available inventory. 
            No cancellation penalty has been levied against you.
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'inline-block',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ color: '#34d399', fontSize: '0.9rem' }}>✅ 500 kg released to available pool</div>
            <div style={{ color: '#34d399', fontSize: '0.9rem' }}>✅ Cancellation recorded in immutable demo ledger</div>
            <div style={{ color: '#34d399', fontSize: '0.9rem' }}>✅ Safe alternative matching ready</div>
          </div>

          <div>
            <button 
              className="btn-wizard btn-confirm"
              onClick={onSearchAlternatives}
              style={{ display: 'inline-flex', margin: '0 auto' }}
            >
              <span>Search For Alternative Buyers Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* SIMPLE 7-STEP HORIZONTAL TRACKER (Requirement 13) */
        <div className="farmer-stepper-horizontal">
          {farmerSteps.map((step, idx) => {
            const isCompleted = currentStepIdx > idx;
            const isActive = currentStepIdx === idx;

            return (
              <div 
                key={step.key}
                className={`farmer-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="farmer-step-circle">
                  {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                </div>
                <span className="farmer-step-name">{step.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* QUALITY CHANGE DISCREPANCY ALERT (Requirement 10) */}
      {hasQualityDiscrepancy && (
        <div className="quality-alert-banner">
          <div className="quality-alert-icon">⚠️</div>
          <div className="quality-alert-content">
            <h3>⚠️ QUALITY CHANGE DETECTED — QUALITY REVIEW REQUIRED</h3>
            <p>
              Delivery inspection logged <strong>Grade B</strong> (25 kg crushed in transit) vs initial 
              farmer declaration of <strong>Grade A</strong>.
            </p>
            <p style={{ marginTop: '6px', fontStyle: 'italic', color: '#fca5a5' }}>
              «KrishiMarg Rule: Do not automatically blame the farmer, transporter or buyer. 
              Reviewing multi-point checkpoint audit to identify transit vs harvest causation.»
            </p>
          </div>
        </div>
      )}

      {/* 3 PHYSICAL QUALITY CHECKPOINTS CARD (Requirement 10) */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>3 Physical Quality Checkpoints</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              End-to-end quality validation across the physical journey
            </span>
          </div>
          <span className="badge-tag badge-demo">AUDITED CHECKPOINTS</span>
        </div>

        <div className="checkpoints-grid">
          {/* Checkpoint 1: Registration */}
          <div className="checkpoint-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CHECKPOINT 1</span>
              <span className="badge-tag badge-farmer-declared">FARMER DECLARED</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>Grade A</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Location: Farm Gate, Khed<br />
              Damage: 0% (Clean Breaker Stage)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Inspector: Self-declared by Farmer
            </div>
          </div>

          {/* Checkpoint 2: Pickup */}
          <div className="checkpoint-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CHECKPOINT 2</span>
              <span className="badge-tag badge-trusted">INSPECTED AT PICKUP</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>Grade A</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Location: Loading Dock<br />
              Condition: Good (2% transit damage)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Inspector: EcoVan Field Logistics
            </div>
          </div>

          {/* Checkpoint 3: Delivery */}
          <div className={`checkpoint-card ${hasQualityDiscrepancy ? 'flagged' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CHECKPOINT 3</span>
              <span className={`badge-tag ${hasQualityDiscrepancy ? 'badge-needs-verification' : 'badge-demo'}`}>
                {hasQualityDiscrepancy ? 'DISCREPANCY DETECTED' : 'DELIVERY AUDIT'}
              </span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: hasQualityDiscrepancy ? '#f87171' : '#fbbf24' }}>
              {hasQualityDiscrepancy ? 'Grade B' : 'Grade A / Pending'}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Location: FreshMart Central Dock<br />
              {hasQualityDiscrepancy ? 'Damage: Minor Crushing (25 kg affected)' : 'Final unloading gate inspection'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Inspector: Retail Receiving Officer
            </div>
          </div>
        </div>
      </div>

      {/* DEMO CONTROLS (For Live SIH Presentation Testing) */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#a7f3d0' }}>🛠️ Live Demo Simulation Controls</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Instantly test physical state transitions, quality drift, and buyer cancellation for SIH judges.
            </p>
          </div>
          <span className="badge-tag badge-demo">INTERACTIVE DEMO</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-view-details" 
            onClick={() => onSimulateStage('PICKUP_COMPLETED')}
            disabled={isCancelled}
          >
            📦 1. Simulate Pickup Done
          </button>

          <button 
            className="btn-view-details" 
            onClick={() => onSimulateStage('IN_TRANSIT')}
            disabled={isCancelled}
          >
            🚚 2. Simulate In Transit
          </button>

          <button 
            className="btn-view-details" 
            onClick={() => onAddQualityCheckpoint({
              stage: 'DELIVERY',
              declaredGrade: 'Grade B',
              damagedPercent: 5,
              affectedKg: 25,
              notes: 'Crushed bottom crates observed at delivery. 25 kg affected.'
            })}
            disabled={isCancelled}
            style={{ color: '#fca5a5', borderColor: '#ef4444' }}
          >
            ⚠️ 3. Trigger Quality Drift (Grade B)
          </button>

          <button 
            className="btn-view-details" 
            onClick={() => onSimulateStage('COMPLETED', 'DEMO PAYMENT STATUS: Payment Completed — DEMO (₹14,000 via UPI Escrow)')}
            disabled={isCancelled}
            style={{ color: '#34d399', borderColor: '#10b981' }}
          >
            💰 4. Complete Demo Payment (₹14,000)
          </button>

          <button 
            className="btn-view-details" 
            onClick={() => onCancelOrder('Buyer cancelled due to local mandi price collapse')}
            style={{ color: '#f87171', borderColor: '#ef4444' }}
          >
            🛑 5. Simulate Buyer Cancellation
          </button>

          <button 
            className="btn-view-details" 
            onClick={() => setShowTraceModal(true)}
            style={{ marginLeft: 'auto', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: '#a855f7' }}
          >
            📜 View Full Traceability Log
          </button>
        </div>
      </div>

      {/* TRACEABILITY MODAL (Requirement 16: RECORDED DEMO EVENT) */}
      {showTraceModal && (
        <div className="modal-overlay" onClick={() => setShowTraceModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowTraceModal(false)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <FileText size={26} style={{ color: '#a855f7' }} />
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Digital Traceability Ledger</h3>
                <span className="badge-tag badge-recorded-event">RECORDED DEMO EVENT</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              End-to-end timeline tracking physical handoffs from farm to delivery dock:
            </p>

            <div className="trace-timeline">
              {lot.traceabilityEvents?.map((evt, idx) => (
                <div key={evt.id || idx} className="trace-event-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '1rem' }}>{evt.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{evt.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '4px' }}>
                    Actor: {evt.actor} • Location: {evt.location}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {evt.details}
                  </p>
                  <div style={{ marginTop: '8px' }}>
                    <span className="badge-tag badge-recorded-event">{evt.badge || 'RECORDED DEMO EVENT'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
