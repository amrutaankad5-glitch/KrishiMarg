import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  PlusCircle, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Award,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FpoPortal({ 
  fpoMembers, 
  aggregations, 
  onCreateAggregation, 
  onAssistedRegister,
  lang 
}) {
  const [activeTab, setActiveTab] = useState('aggregation'); // 'aggregation' or 'assisted_entry'
  
  // Assisted entry state
  const [assistedName, setAssistedName] = useState('');
  const [assistedPhone, setAssistedPhone] = useState('');
  const [assistedCrop, setAssistedCrop] = useState('Tomato');
  const [assistedQty, setAssistedQty] = useState(300);
  const [assistedSuccess, setAssistedSuccess] = useState(false);

  // Aggregation state: select farmer lots
  const [selectedFarmers, setSelectedFarmers] = useState(['FARMER-001', 'FARMER-002']); // Seeded with Farmer A (300kg) & Farmer B (200kg)

  const toggleFarmerSelection = (farmerId) => {
    if (selectedFarmers.includes(farmerId)) {
      setSelectedFarmers(selectedFarmers.filter(id => id !== farmerId));
    } else {
      setSelectedFarmers([...selectedFarmers, farmerId]);
    }
  };

  const selectedTotalKg = fpoMembers
    .filter(m => selectedFarmers.includes(m.id))
    .reduce((sum, m) => sum + m.quantity, 0);

  const handleCreateBatch = () => {
    const selectedLots = fpoMembers
      .filter(m => selectedFarmers.includes(m.id))
      .map(m => ({
        farmerId: m.id,
        farmerName: m.name,
        lotId: m.lotId,
        contributedKg: m.quantity,
        agreedPricePerKg: 30,
        estimatedNetPerKg: 28
      }));

    onCreateAggregation({
      title: `FPO Khed Bulk Tomato Pool (${selectedTotalKg} kg)`,
      targetBuyerId: 'BUYER-A',
      targetBuyerName: 'FreshMart Retail Hub',
      targetQuantity: selectedTotalKg,
      selectedLots,
      notes: 'Consolidated smallholder lots for single 500kg pickup while preserving independent traceability.'
    });

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  const handleAssistedSubmit = (e) => {
    e.preventDefault();
    if (!assistedName || !assistedQty) return;

    onAssistedRegister({
      farmerName: assistedName,
      farmerPhone: assistedPhone || '+91 98000 00000',
      crop: assistedCrop,
      quantity: Number(assistedQty),
      readyDate: 'Next week',
      initialGrade: 'Grade A — Farmer Declared (Assisted CSC)',
      inputMode: 'FPO_ASSISTED'
    });

    setAssistedSuccess(true);
    setTimeout(() => setAssistedSuccess(false), 3000);
    setAssistedName('');
    setAssistedPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.1))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            <h2 style={{ fontSize: '1.5rem' }}>FPO & CSC Field Operator Portal</h2>
            <span className="badge-tag badge-demo">COMMUNITY AGGREGATION</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Empowering village CSC centers and Farmer Producer Organizations to pool lots and bridge the digital divide.
          </p>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn-wizard ${activeTab === 'aggregation' ? 'btn-confirm' : 'btn-edit'}`}
            onClick={() => setActiveTab('aggregation')}
            style={{ fontSize: '0.9rem', padding: '10px 18px' }}
          >
            <Layers size={16} />
            <span>Crop Lot Aggregation (300kg + 200kg)</span>
          </button>

          <button 
            className={`btn-wizard ${activeTab === 'assisted_entry' ? 'btn-confirm' : 'btn-edit'}`}
            onClick={() => setActiveTab('assisted_entry')}
            style={{ fontSize: '0.9rem', padding: '10px 18px' }}
          >
            <PlusCircle size={16} />
            <span>Assisted Farmer Registration</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CROP LOT AGGREGATION (Requirement 12) */}
      {activeTab === 'aggregation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Loophole Rule Alert */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid #3b82f6',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={28} style={{ color: '#60a5fa', flexShrink: 0 }} />
            <div style={{ fontSize: '0.92rem' }}>
              <strong style={{ color: '#93c5fd' }}>Crucial Traceability Rule:</strong> A buyer (e.g. FreshMart) needs 500 kg, but Farmer A has only 300 kg and Farmer B has 200 kg. 
              KrishiMarg aggregates them for transport efficiency, <strong>while keeping individual Lot IDs and farmer quantities separate</strong>.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
            {/* Member Farmers List */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Local Smallholder Crop Lots</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select lots to combine</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fpoMembers.map(farmer => {
                  const isSelected = selectedFarmers.includes(farmer.id);
                  return (
                    <div 
                      key={farmer.id}
                      onClick={() => toggleFarmerSelection(farmer.id)}
                      style={{
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isSelected ? '#10b981' : 'rgba(255,255,255,0.1)',
                          color: isSelected ? 'white' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{farmer.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Village: {farmer.village} • Phone: {farmer.phone}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '2px', fontFamily: 'monospace' }}>
                            Individual Lot: {farmer.lotId}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                          {farmer.quantity} kg
                        </div>
                        <span className="badge-tag badge-farmer-declared">{farmer.declaredGrade}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aggregation Summary Box */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Target Order Match</h3>

                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>BUYER ORDER SPECIFICATION</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, margin: '4px 0' }}>
                    FreshMart Retail Hub (Buyer A)
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Requires: <strong>500 kg Tomato</strong> (Grade A)
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>Selected Farmers:</span>
                    <strong style={{ color: '#34d399' }}>{selectedFarmers.length} Farmers</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>Aggregated Quantity:</span>
                    <strong style={{ 
                      fontSize: '1.25rem', 
                      color: selectedTotalKg === 500 ? '#34d399' : '#fbbf24' 
                    }}>
                      {selectedTotalKg} / 500 kg
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>Est. Farmer Net Payout:</span>
                    <strong>₹{(selectedTotalKg * 28).toLocaleString()} (@ ₹28/kg)</strong>
                  </div>
                </div>

                {selectedTotalKg === 500 ? (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    borderRadius: 'var(--radius-md)',
                    color: '#34d399',
                    fontSize: '0.88rem',
                    marginBottom: '1.25rem'
                  }}>
                    ✨ Perfect 500 kg Match: Farmer A (300 kg) + Farmer B (200 kg) meets Buyer A order!
                  </div>
                ) : (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid #f59e0b',
                    borderRadius: 'var(--radius-md)',
                    color: '#fbbf24',
                    fontSize: '0.88rem',
                    marginBottom: '1.25rem'
                  }}>
                    Current pool is {selectedTotalKg} kg. Select lots totaling 500 kg for Buyer A.
                  </div>
                )}
              </div>

              <button 
                className="btn-accept-route"
                onClick={handleCreateBatch}
                disabled={selectedFarmers.length < 2}
                style={{
                  opacity: selectedFarmers.length < 2 ? 0.5 : 1,
                  cursor: selectedFarmers.length < 2 ? 'not-allowed' : 'pointer'
                }}
              >
                <span>Combine & Dispatch 500 kg Batch</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Existing Batches */}
          {aggregations.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Active FPO Aggregated Batches</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aggregations.map(agg => (
                  <div 
                    key={agg.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{agg.title}</span>
                        <span className="badge-tag badge-farmer-declared">{agg.id}</span>
                        <span className="badge-tag badge-demo">{agg.status}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {agg.notes}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', fontSize: '0.82rem', color: '#34d399' }}>
                        {agg.participatingFarmers.map(f => (
                          <span key={f.farmerId}>
                            👤 {f.farmerName} ({f.contributedKg} kg • Lot: {f.lotId})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                        ₹{agg.totalPayoutEst?.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preserved Traceability</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSISTED FARMER REGISTRATION (Requirement 17) */}
      {activeTab === 'assisted_entry' && (
        <div style={{
          maxWidth: '620px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem'
        }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>CSC Operator Assisted Entry</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Register produce on behalf of smallholder farmers who do not own a smartphone or require regional language support.
          </p>

          {assistedSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: '#34d399',
              marginBottom: '1.5rem',
              fontWeight: 600
            }}>
              ✅ Successfully registered lot! Generated tracking SMS alert for farmer.
            </div>
          )}

          <form onSubmit={handleAssistedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Farmer Full Name
              </label>
              <input 
                type="text"
                placeholder="e.g. Maruti Gaikwad"
                value={assistedName}
                onChange={e => setAssistedName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-light)',
                  color: 'white'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Mobile Number (for SMS & Voice Alerts)
              </label>
              <input 
                type="text"
                placeholder="+91 98XXX XXXXX"
                value={assistedPhone}
                onChange={e => setAssistedPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-light)',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Crop Type
                </label>
                <select 
                  value={assistedCrop}
                  onChange={e => setAssistedCrop(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    color: 'white'
                  }}
                >
                  <option value="Tomato">Tomato (Perishable)</option>
                  <option value="Potato">Potato</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Quantity (kg)
                </label>
                <input 
                  type="number"
                  value={assistedQty}
                  onChange={e => setAssistedQty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    color: 'white'
                  }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="btn-wizard btn-confirm"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            >
              <Check size={20} />
              <span>Submit Assisted Registration & Generate Lot</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
