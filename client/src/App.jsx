import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FarmerHome from './components/FarmerHome';
import CropWizard from './components/CropWizard';
import RouteComparison from './components/RouteComparison';
import TrackingView from './components/TrackingView';
import FpoPortal from './components/FpoPortal';
import BuyerPortal from './components/BuyerPortal';
import JudgeDashboard from './components/JudgeDashboard';

import { 
  fetchLots, 
  fetchRecommendations, 
  reserveInventory, 
  cancelInventoryReservation, 
  advanceLotStage, 
  addQualityCheckpoint,
  fetchSupplyChain,
  fetchFpoMembers,
  fetchAggregations,
  createAggregation,
  fetchAuditLogs,
  resetDemoData,
  createLot
} from './utils/api';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('farmer'); // 'farmer', 'fpo', 'buyer', 'judge'
  const [farmerView, setFarmerView] = useState('home'); // 'home', 'wizard', 'routes', 'track'
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  
  // Data State
  const [lots, setLots] = useState([]);
  const [activeLot, setActiveLot] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [supplyChainData, setSupplyChainData] = useState([]);
  const [fpoMembers, setFpoMembers] = useState([]);
  const [aggregations, setAggregations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [buyersList, setBuyersList] = useState([]);
  
  // Voice & Simulation State
  const [initialVoicePhrase, setInitialVoicePhrase] = useState('');
  const [isSimulatedNoBuyer, setIsSimulatedNoBuyer] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [lotsRes, scRes, membersRes, aggRes, auditRes] = await Promise.all([
        fetchLots(),
        fetchSupplyChain(),
        fetchFpoMembers(),
        fetchAggregations(),
        fetchAuditLogs()
      ]);

      if (lotsRes?.data) {
        setLots(lotsRes.data);
        const tomLot = lotsRes.data.find(l => l.id === 'LOT-TOM-001') || lotsRes.data[0];
        setActiveLot(tomLot);

        // Fetch recommendations for active lot
        if (tomLot) {
          const recRes = await fetchRecommendations(tomLot.id, isSimulatedNoBuyer);
          setRoutesData(recRes);
        }
      }

      if (scRes?.data) setSupplyChainData(scRes.data);
      if (membersRes?.data) setFpoMembers(membersRes.data);
      if (aggRes?.data) setAggregations(aggRes.data);
      if (auditRes?.data) setAuditLogs(auditRes.data);
    } catch (err) {
      console.error('Error loading initial KrishiMarg data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Update recommendations when activeLot or simulation changes
  const refreshRecommendations = async (lotId, simulateNo = isSimulatedNoBuyer) => {
    if (!lotId) return;
    try {
      const recRes = await fetchRecommendations(lotId, simulateNo);
      setRoutesData(recRes);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  // Farmer Home Actions
  const handleFarmerAction = (action) => {
    if (action === 'sell') {
      setInitialVoicePhrase('');
      setFarmerView('wizard');
    } else if (action === 'track') {
      setFarmerView('track');
    } else if (action === 'earnings') {
      refreshRecommendations(activeLot?.id);
      setFarmerView('routes');
    } else if (action === 'fpo_help') {
      setCurrentRole('fpo');
    }
  };

  // Voice Input Detected
  const handleVoiceDetected = (phrase) => {
    setInitialVoicePhrase(phrase);
    setFarmerView('wizard');
  };

  // Crop Registered via Wizard
  const handleCropRegistered = async (newLotData) => {
    try {
      const res = await createLot(newLotData);
      if (res?.data) {
        setLots(prev => [res.data, ...prev]);
        setActiveLot(res.data);
        await refreshRecommendations(res.data.id);
        setFarmerView('routes');
      }
    } catch (err) {
      console.error('Error registering crop:', err);
    }
  };

  // Farmer Accepts Route Offer
  const handleAcceptRoute = async (route) => {
    try {
      const res = await reserveInventory(
        activeLot.id, 
        route.buyerId, 
        activeLot.quantity,
        {
          buyerName: route.buyerName,
          offeredPrice: route.nominalOfferPerKg,
          netPrice: route.netPricePerKg,
          totalTakeHome: route.totalEstimatedEarnings,
          pickupTime: route.pickupSchedule
        }
      );

      // Advance stage to OFFER_ACCEPTED / PICKUP_SCHEDULED
      await advanceLotStage(activeLot.id, 'PICKUP_SCHEDULED', 'DEMO PAYMENT STATUS: Pending Farm Gate Pickup');

      // Refresh lot state
      const updatedLots = await fetchLots();
      setLots(updatedLots.data);
      const current = updatedLots.data.find(l => l.id === activeLot.id);
      setActiveLot(current);
      setFarmerView('track');
    } catch (err) {
      console.error('Error accepting route:', err);
    }
  };

  // Cancel Order & Rollback (Requirement 14)
  const handleCancelOrder = async (reason) => {
    try {
      await cancelInventoryReservation(activeLot.id, reason);
      const updatedLots = await fetchLots();
      setLots(updatedLots.data);
      const current = updatedLots.data.find(l => l.id === activeLot.id);
      setActiveLot(current);
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  // Simulate Stage Progression
  const handleSimulateStage = async (stage, paymentStatus) => {
    try {
      await advanceLotStage(activeLot.id, stage, paymentStatus);
      const updatedLots = await fetchLots();
      setLots(updatedLots.data);
      const current = updatedLots.data.find(l => l.id === activeLot.id);
      setActiveLot(current);
    } catch (err) {
      console.error('Error advancing stage:', err);
    }
  };

  // Add Quality Checkpoint (Requirement 10)
  const handleAddQualityCheckpoint = async (checkpointData) => {
    try {
      await addQualityCheckpoint(activeLot.id, checkpointData);
      const updatedLots = await fetchLots();
      setLots(updatedLots.data);
      const current = updatedLots.data.find(l => l.id === activeLot.id);
      setActiveLot(current);
    } catch (err) {
      console.error('Error recording quality checkpoint:', err);
    }
  };

  // FPO Create Aggregated Batch
  const handleCreateAggregation = async (aggData) => {
    try {
      const res = await createAggregation(aggData);
      if (res?.data) {
        setAggregations(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error('Error creating aggregation batch:', err);
    }
  };

  // Buyer Portal: Make Offer
  const handleBuyerMakeOffer = async (offerData) => {
    try {
      await reserveInventory(offerData.lotId, offerData.buyerId, offerData.quantity, offerData);
      const updatedLots = await fetchLots();
      setLots(updatedLots.data);
      const current = updatedLots.data.find(l => l.id === offerData.lotId);
      setActiveLot(current);
    } catch (err) {
      console.error('Error placing buyer offer:', err);
    }
  };

  // Toggle No Buyer Simulation
  const handleToggleNoBuyer = () => {
    const nextState = !isSimulatedNoBuyer;
    setIsSimulatedNoBuyer(nextState);
    refreshRecommendations(activeLot?.id, nextState);
  };

  // Reset Demo to Default Seed Data
  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      await resetDemoData();
      await loadAllData();
      setFarmerView('home');
      setIsSimulatedNoBuyer(false);
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar with Role Switcher & Language Toggle */}
      <Navbar 
        currentRole={currentRole}
        onSelectRole={(role) => setCurrentRole(role)}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'en' ? 'hi' : 'en')}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌾</div>
            <h2>Connecting to KrishiMarg Engine...</h2>
          </div>
        ) : (
          <>
            {/* 1. FARMER MODE */}
            {currentRole === 'farmer' && (
              <>
                {farmerView === 'home' && (
                  <FarmerHome 
                    onActionSelect={handleFarmerAction}
                    onVoiceDetected={handleVoiceDetected}
                    lang={lang}
                    activeLot={activeLot}
                  />
                )}

                {farmerView === 'wizard' && (
                  <CropWizard 
                    initialVoicePhrase={initialVoicePhrase}
                    onRegistered={handleCropRegistered}
                    onCancel={() => setFarmerView('home')}
                    lang={lang}
                  />
                )}

                {farmerView === 'routes' && activeLot && (
                  <RouteComparison 
                    lot={activeLot}
                    routesData={routesData}
                    onAcceptRoute={handleAcceptRoute}
                    onBack={() => setFarmerView('home')}
                    lang={lang}
                    onSimulateNoBuyers={handleToggleNoBuyer}
                    isSimulatedNoBuyer={isSimulatedNoBuyer}
                  />
                )}

                {farmerView === 'track' && activeLot && (
                  <TrackingView 
                    lot={activeLot}
                    onCancelOrder={handleCancelOrder}
                    onSimulateStage={handleSimulateStage}
                    onAddQualityCheckpoint={handleAddQualityCheckpoint}
                    onSearchAlternatives={() => {
                      refreshRecommendations(activeLot.id);
                      setFarmerView('routes');
                    }}
                    lang={lang}
                  />
                )}
              </>
            )}

            {/* 2. FPO / CSC MODE */}
            {currentRole === 'fpo' && (
              <FpoPortal 
                fpoMembers={fpoMembers}
                aggregations={aggregations}
                onCreateAggregation={handleCreateAggregation}
                onAssistedRegister={handleCropRegistered}
                lang={lang}
              />
            )}

            {/* 3. BUYER MODE */}
            {currentRole === 'buyer' && (
              <BuyerPortal 
                lots={lots}
                onMakeOffer={handleBuyerMakeOffer}
                lang={lang}
              />
            )}

            {/* 4. JUDGE / ADMIN MODE */}
            {currentRole === 'judge' && (
              <JudgeDashboard 
                lot={activeLot || lots[0]}
                buyers={routesData?.routes?.map(r => r.adminDetails?.feasibilityMatrix) || []}
                supplyChainData={supplyChainData}
                auditLogs={auditLogs}
                onResetDemo={handleResetDemo}
                onTriggerStepAction={(action) => console.log('Tour action:', action)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
