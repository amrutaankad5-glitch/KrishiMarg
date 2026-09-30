import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Calculator,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

export default function RouteComparison({ 
  lot, 
  routesData, 
  onAcceptRoute, 
  onBack, 
  lang,
  onSimulateNoBuyers,
  isSimulatedNoBuyer
}) {
  const t = translations[lang];
  const [selectedRouteForDetails, setSelectedRouteForDetails] = useState(null);
  const [showWhyModal, setShowWhyModal] = useState(false);

  const routes = routesData?.routes || [];

  const handleAccept = (route) => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
    onAcceptRoute(route);
  };

  return (
    <div className="routes-container">
      {/* Top Banner with Core Rule */}
      <div className="route-hero-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {lot.crop} ({lot.quantity} kg) — Market Analysis
            </span>
            <span className="badge-tag badge-demo">DEMO DATA</span>
            <span className="badge-tag badge-estimated">ESTIMATED MATH</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            KrishiMarg evaluated logistics feasibility, true transport deductions, and perishability delays.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-view-details" 
            onClick={() => setShowWhyModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Info size={15} />
            <span>{t.whyRecommendation}</span>
          </button>

          <button 
            className="btn-view-details" 
            onClick={onSimulateNoBuyers}
            style={{ 
              borderColor: isSimulatedNoBuyer ? '#f59e0b' : 'var(--border-light)',
              color: isSimulatedNoBuyer ? '#fbbf24' : 'var(--text-secondary)'
            }}
          >
            {isSimulatedNoBuyer ? 'Show Active Buyers' : 'Simulate: No Buyer'}
          </button>
        </div>
      </div>

      {/* NO BUYER SCENARIO FALLBACK (Requirement 9) */}
      {isSimulatedNoBuyer || routes.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#f8fafc' }}>
            No suitable buyer currently available.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
            We could not find a buyer meeting your exact quantity, perishability window, or corridor constraints. 
            Do not worry — explore these recommended actions:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>📡</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Expand search radius</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Increase procurement distance up to 100 km across neighboring talukas.
              </p>
              <span className="badge-tag badge-demo">Action: +50 km Radius</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>📅</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Extend pickup date</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Adjust dispatch date by +2 to +4 days for scheduled institutional buyers.
              </p>
              <span className="badge-tag badge-demo">Action: +3 Days Window</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>🤝</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Ask FPO to aggregate crop</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Combine your 500 kg with nearby farmers to qualify for bulk 2,000 kg purchase.
              </p>
              <span className="badge-tag badge-farmer-declared">Recommended for Smallholders</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>🏛️</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Try another market / APMC</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Benchmark spot auction at Pune APMC Yard with factoring of mandi cess and transport.
              </p>
              <span className="badge-tag badge-needs-verification">Benchmark Rate: ₹24/kg</span>
            </div>
          </div>
        </div>
      ) : (
        /* ROUTE CARDS GRID */
        <div className="route-cards-grid">
          {routes.map((route, idx) => {
            const isRec = route.isRecommended;
            const isFeas = route.isFeasible;

            return (
              <div 
                key={route.buyerId || idx}
                className={`route-card ${isRec ? 'recommended' : ''}`}
                style={{ opacity: isFeas ? 1 : 0.8 }}
              >
                {/* Ribbon */}
                {isRec && (
                  <div className="route-card-ribbon">
                    <Award size={14} />
                    <span>{t.recommendedForYou}</span>
                  </div>
                )}

                {/* Header */}
                <div className="route-header-row">
                  <div className="route-buyer-title">
                    <h3>{route.buyerName}</h3>
                    <div className="route-buyer-subtitle">
                      <span>{route.buyerType}</span>
                      <span>•</span>
                      <MapPin size={13} />
                      <span>{route.distanceKm || '150'} km</span>
                    </div>
                  </div>

                  <div>
                    {route.trustColor === 'green' ? (
                      <span className="badge-tag badge-trusted">
                        🟢 {route.trustBadge}
                      </span>
                    ) : route.trustColor === 'yellow' ? (
                      <span className="badge-tag badge-limited">
                        🟡 {route.trustBadge}
                      </span>
                    ) : (
                      <span className="badge-tag badge-demo">
                        {route.trustBadge || 'Buyer'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Realization Box */}
                {isFeas ? (
                  <div className="route-price-box">
                    <div className="price-row-nominal">
                      <span>{t.buyerOffers}:</span>
                      <span style={{ fontWeight: 700, textDecoration: !isRec ? 'line-through' : 'none' }}>
                        ₹{route.nominalOfferPerKg}/kg
                      </span>
                    </div>

                    <div className="price-row-net">
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {t.afterCosts}:
                      </span>
                      <span className="net-price-value">
                        ₹{route.netPricePerKg}
                        <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/kg</span>
                      </span>
                    </div>

                    <div className="earnings-total-pill">
                      <span>{lot.quantity} kg estimated:</span>
                      <span>₹{route.totalEstimatedEarnings?.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    color: '#fca5a5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, marginBottom: '6px' }}>
                      <XCircle size={20} style={{ color: '#ef4444' }} />
                      <span>{route.headline}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#fecaca' }}>
                      {route.simpleReason}
                    </p>
                  </div>
                )}

                {/* Core Plain-English Explanation (Requirement 5 & 6) */}
                {route.explanationText && (
                  <div className="farmer-explanation-quote">
                    {route.explanationText}
                  </div>
                )}

                {/* Bullets (Pro/Con) */}
                {route.simpleBullets && (
                  <ul className="farmer-bullets-list">
                    {route.simpleBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className={isRec ? 'pro' : 'con'}>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pickup & Delivery Summary Bar (Requirement 3) */}
                {isFeas && route.pickupDeliverySummary && (
                  <div className="farmer-logistics-bar">
                    <div className="logistics-item-check">
                      <CheckCircle2 size={16} />
                      <span>{t.pickupArranged}</span>
                    </div>
                    <div className="logistics-item-check">
                      <CheckCircle2 size={16} />
                      <span>{t.vehicleAvailable}</span>
                    </div>
                    <div className="logistics-item-check">
                      <CheckCircle2 size={16} />
                      <span>{t.deliveryPossible}</span>
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {isFeas ? (
                    <button 
                      className="btn-accept-route"
                      onClick={() => handleAccept(route)}
                      style={{
                        background: isRec 
                          ? 'linear-gradient(135deg, #10b981, #059669)' 
                          : 'linear-gradient(135deg, #f59e0b, #d97706)'
                      }}
                    >
                      <span>{t.acceptOffer}</span>
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)'
                    }}>
                      Route blocked: Logistics requirements unmet
                    </div>
                  )}

                  <button 
                    className="btn-view-details"
                    onClick={() => setSelectedRouteForDetails(route)}
                    style={{ textAlign: 'center' }}
                  >
                    🔍 {t.viewDetails} (Logistics & Physical Handlers)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: "WHY THIS RECOMMENDATION?" (Scoring & Realization Math) */}
      {showWhyModal && (
        <div className="modal-overlay" onClick={() => setShowWhyModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowWhyModal(false)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🥇</span>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>Why KrishiMarg Recommended Route A</h3>
                <span className="badge-tag badge-demo">Deterministic Scoring Formula</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              <strong>Key Hackathon Insight:</strong> Higher nominal price does not mean higher farmer earnings.
              Buyer B offers <strong>₹33/kg</strong>, but long transit (150 km) and a 3-day delay incurs <strong>₹7.00/kg</strong> in deductions, leaving <strong>₹26/kg</strong>.
              Buyer A offers <strong>₹30/kg</strong>, but fast 20 km local transit incurs only <strong>₹2.00/kg</strong>, leaving <strong>₹28/kg</strong>.
            </div>

            <h4 style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>Composite Scoring Weights:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <span>1. Net Farmer Realization (₹28 vs ₹26)</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>40% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <span>2. Logistics Feasibility (Dedicated vehicle vs 3rd party)</span>
                <span style={{ fontWeight: 700, color: '#60a5fa' }}>20% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <span>3. Pickup Speed (Tomorrow vs 3 days delay)</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>15% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <span>4. Buyer Reliability (25 completed vs 2 deals)</span>
                <span style={{ fontWeight: 700, color: '#c084fc' }}>15% Weight</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <span>5. Spoilage Risk (Tomato = High perishability)</span>
                <span style={{ fontWeight: 700, color: '#f87171' }}>10% Weight</span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Route A (FreshMart)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>86 / 100</div>
                <div style={{ fontSize: '0.8rem', color: '#d1fae5' }}>Recommended Route</div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #f59e0b' }}>
                <div style={{ fontSize: '0.85rem', color: '#fde68a' }}>Route B (Metro Agro)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>64 / 100</div>
                <div style={{ fontSize: '0.8rem', color: '#fef3c7' }}>Alternative Route</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOGISTICS & PHYSICAL HANDLERS (Requirement 3: Who Actually Handles The Crop?) */}
      {selectedRouteForDetails && (
        <div className="modal-overlay" onClick={() => setSelectedRouteForDetails(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedRouteForDetails(null)}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Truck size={28} style={{ color: '#10b981' }} />
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Physical Movement & Handler Audit</h3>
                <span className="badge-tag badge-demo">{selectedRouteForDetails.buyerName}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              KrishiMarg does not assume digital matching solves physical logistics. Every handler is verified below:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Who picks up?</div>
                <div style={{ fontWeight: 600 }}>{selectedRouteForDetails.logisticsDetails?.whoPicksUp || 'EcoVan Field Logistics'}</div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Who provides vehicle?</div>
                <div style={{ fontWeight: 600 }}>{selectedRouteForDetails.logisticsDetails?.whoProvidesVehicle || 'Dedicated Ventilated Mini-Truck'}</div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Who loads & unloads?</div>
                <div style={{ fontWeight: 600 }}>
                  Loading: {selectedRouteForDetails.logisticsDetails?.whoLoads || 'Transporter Crew'} | 
                  Unloading: {selectedRouteForDetails.logisticsDetails?.whoUnloads || 'Central Intake Bay'}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Storage Needed & Available?</div>
                <div style={{ fontWeight: 600 }}>
                  Needed: {selectedRouteForDetails.logisticsDetails?.storageNeeded ? 'Yes' : 'No (Direct transit)'} | 
                  Storage Available: {selectedRouteForDetails.logisticsDetails?.storageAvailable ? '✅ Pre-booked' : '❌ Unavailable'}
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timing & Freight Cost</div>
                <div style={{ fontWeight: 600 }}>
                  Pickup: {selectedRouteForDetails.logisticsDetails?.pickupTime || '09:30 AM Tomorrow'} | 
                  Delivery: {selectedRouteForDetails.logisticsDetails?.deliveryTime || '12:30 PM Tomorrow'} | 
                  Freight Cost: ₹{selectedRouteForDetails.logisticsDetails?.transportCostTotal || 500}
                </div>
              </div>
            </div>

            <button 
              className="btn-wizard btn-confirm" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setSelectedRouteForDetails(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
