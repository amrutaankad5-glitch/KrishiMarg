import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET all lots
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: store.getLots(),
    meta: { badge: 'DEMO DATA', count: store.getLots().length }
  });
});

// GET lot by ID
router.get('/:id', (req, res) => {
  const lot = store.getLotById(req.params.id);
  if (!lot) {
    return res.status(404).json({ success: false, message: 'Crop lot not found' });
  }
  res.json({
    success: true,
    data: lot,
    meta: { badge: 'DEMO DATA' }
  });
});

// POST new lot (voice or manual)
router.post('/', (req, res) => {
  try {
    const { crop, quantity, readyDate, initialGrade, farmerName, location, inputMode } = req.body;
    
    if (!crop || !quantity) {
      return res.status(400).json({ success: false, message: 'Crop name and quantity are required' });
    }

    const newLot = store.addLot({
      crop: crop.trim(),
      quantity: Number(quantity),
      readyDate: readyDate || 'Next week',
      initialGrade: initialGrade || 'Grade A — Farmer Declared',
      farmerName: farmerName || 'Ramesh Patel',
      location: location || 'Khed Village, Pune'
    });

    res.status(201).json({
      success: true,
      message: 'Crop registered successfully',
      data: newLot,
      understoodSummary: {
        crop: newLot.crop,
        quantity: `${newLot.quantity} kg`,
        readyDate: newLot.readyDate,
        grade: newLot.initialGrade,
        lotId: newLot.id,
        badge: 'FARMER DECLARED'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add quality checkpoint (3 checkpoints demo)
router.post('/:id/checkpoints', (req, res) => {
  try {
    const { stage, declaredGrade, status, damagedPercent, affectedKg, inspector, notes } = req.body;
    const lot = store.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ success: false, message: 'Lot not found' });

    const newCheckpoint = {
      id: `CHK-${Date.now()}`,
      stage: stage || 'DELIVERY',
      title: stage === 'PICKUP' ? 'Farm-Gate Pickup Inspection' : 'Destination Delivery Audit',
      declaredGrade: declaredGrade || 'Grade B',
      status: status || 'DISCREPANCY FLAGGED',
      damagedPercent: Number(damagedPercent) || 0,
      affectedKg: Number(affectedKg) || 0,
      inspector: inspector || 'Quality Inspector',
      location: lot.location,
      timestamp: new Date().toISOString(),
      notes: notes || 'Quality inspection recorded.'
    };

    lot.checkpoints.push(newCheckpoint);

    // If grade shifted from Grade A to Grade B or damage detected, add quality review alert
    let qualityDiscrepancy = false;
    if (stage === 'DELIVERY' && (declaredGrade !== 'Grade A' || damagedPercent > 3)) {
      qualityDiscrepancy = true;
      lot.currentStage = 'QUALITY_REVIEW';
      lot.traceabilityEvents.push({
        id: `TRC-${Date.now()}`,
        type: 'QUALITY_REVIEW_TRIGGERED',
        title: '⚠️ QUALITY CHANGE DETECTED',
        actor: 'KrishiMarg Automated Audit Guard',
        location: 'Destination Facility',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'RECORDED DEMO EVENT',
        details: `Discrepancy logged: Declared ${lot.checkpoints[0]?.declaredGrade || 'Grade A'} vs Delivered ${declaredGrade} (${affectedKg} kg affected). Quality review opened. Impartial audit initiated without automated fault assignment.`
      });
    }

    res.json({
      success: true,
      message: qualityDiscrepancy ? 'Quality discrepancy recorded. Review required.' : 'Checkpoint recorded',
      qualityDiscrepancy,
      data: lot
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST advance transaction stage
router.post('/:id/advance-stage', (req, res) => {
  try {
    const { stage, paymentStatus } = req.body;
    const lot = store.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ success: false, message: 'Lot not found' });

    lot.currentStage = stage;
    if (paymentStatus) {
      lot.paymentStatus = paymentStatus;
    }

    // Add traceability event
    const stageTitles = {
      OFFER_ACCEPTED: '🤝 Offer Accepted',
      PICKUP_SCHEDULED: '📅 Pickup Scheduled',
      PICKUP_COMPLETED: '📦 Farm Gate Pickup Completed',
      IN_TRANSIT: '🚚 Crop in Transit',
      DELIVERED: '🏁 Delivered to Buyer Facility',
      QUALITY_REVIEW: '🔍 Quality Inspection Completed',
      PAYMENT_COMPLETED: '💰 Payment Settled — DEMO'
    };

    lot.traceabilityEvents.push({
      id: `TRC-${Date.now()}`,
      type: stage,
      title: stageTitles[stage] || `Stage: ${stage}`,
      actor: 'KrishiMarg Orchestrator',
      location: lot.location,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'RECORDED DEMO EVENT',
      details: `Crop lot transitioned to stage: ${stage}. ${paymentStatus ? `Status: ${paymentStatus}` : ''}`
    });

    res.json({ success: true, data: lot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
