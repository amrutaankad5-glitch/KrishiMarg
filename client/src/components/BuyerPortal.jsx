import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyerPortal({ 
  lots, 
  onMakeOffer, 
  onConfirmDelivery,
  lang 
}) {
  const [selectedBuyer, setSelectedBuyer] = useState('BUYER-A');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'orders'
  const [offerPrice, setOfferPrice] = useState(30);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const activeLot = lots.find(l => l.id === 'LOT-TOM-001') || lots[0];

  const handleBookPickup = (lot) => {
    onMakeOffer({
      lotId: lot.id,
      buyerId: selectedBuyer,
      buyerName: selectedBuyer === 'BUYER-A' ? 'FreshMart Retail Hub' : 'Metro Agro Wholesaler',
      offeredPrice: offerPrice,
      quantity: lot.availableQuantity || lot.quantity
    });

    setBookingSuccess(true);
    try {
      confetti({ particleCount: 60 });
    } catch (e) {}
    setTimeout(() => setBookingSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Buyer Identity Switcher */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.1))',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.5rem' }}>💼</span>
            <h2 style={{ fontSize: '1.5rem' }}>Verified Buyer Procurement Portal</h2>
            <span className="badge-tag badge-demo">COMMERCIAL WORKFLOW</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Procure verified crop lots directly with scheduled farm-gate pickup and quality checkpoints.
          </p>
        </div>

        {/* Switch Buyer Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Buyer Persona:</span>
          <button 
            className={`btn-wizard ${selectedBuyer === 'BUYER-A' ? 'btn-confirm' : 'btn-edit'}`}
            onClick={() => { setSelectedBuyer('BUYER-A'); setOfferPrice(30); }}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Buyer A (FreshMart - ₹30/kg)
          </button>
          <button 
            className={`btn-wizard ${selectedBuyer === 'BUYER-B' ? 'btn-confirm' : 'btn-edit'}`}
            onClick={() => { setSelectedBuyer('BUYER-B'); setOfferPrice(33); }}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            Buyer B (Metro - ₹33/kg)
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={22} />
          <span>Offer registered and logistics scheduled! Reserved 500 kg from farmer inventory.</span>
        </div>
      )}

      {/* Available Lots Catalog */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Live Farm-Gate Produce Marketplace</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {lots.map(lot => (
            <div 
              key={lot.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
                    {lot.crop === 'Tomato' ? '🍅' : lot.crop === 'Potato' ? '🥔' : '🧅'} {lot.crop}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {lot.id}
                  </span>
                </div>
                <span className="badge-tag badge-farmer-declared">{lot.initialGrade}</span>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Harvest:</span>
                  <strong>{lot.quantity} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Available Balance:</span>
                  <strong style={{ color: lot.availableQuantity > 0 ? '#34d399' : '#f87171' }}>
                    {lot.availableQuantity} kg
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Farm Gate Location:</span>
                  <span>{lot.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Perishability:</span>
                  <span style={{ color: lot.perishability === 'HIGH' ? '#f87171' : '#fbbf24', fontWeight: 700 }}>
                    {lot.perishability}
                  </span>
                </div>
              </div>

              {/* Status or Order Button */}
              {lot.availableQuantity > 0 ? (
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Offer Price:</span>
                    <input 
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(Number(e.target.value))}
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--border-light)',
                        color: 'white',
                        fontWeight: 700
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹/kg</span>
                  </div>

                  <button 
                    className="btn-wizard btn-confirm"
                    onClick={() => handleBookPickup(lot)}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '10px' }}
                  >
                    <span>Place Offer & Schedule Pickup</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div style={{
                  marginTop: 'auto',
                  padding: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: '#fca5a5',
                  fontSize: '0.85rem'
                }}>
                  🔒 100% Reserved by Active Buyer ({lot.assignedBuyerId || 'BUYER-A'})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
