import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET all FPO member lots available for aggregation
router.get('/members', (req, res) => {
  res.json({
    success: true,
    data: store.fpoMembers,
    meta: { badge: 'DEMO DATA' }
  });
});

// GET existing aggregation batches
router.get('/batches', (req, res) => {
  res.json({
    success: true,
    data: store.getAggregations(),
    meta: { badge: 'DEMO DATA' }
  });
});

// POST create an aggregated batch from multiple farmer lots
router.post('/create', (req, res) => {
  try {
    const { title, targetBuyerId, targetBuyerName, targetQuantity, selectedLots, notes } = req.body;

    if (!selectedLots || selectedLots.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least 2 farmer lots to aggregate' });
    }

    const totalAggregatedKg = selectedLots.reduce((acc, curr) => acc + (Number(curr.contributedKg) || 0), 0);

    // Ensure distinct trace records for each participating farmer
    const participatingFarmers = selectedLots.map(item => ({
      farmerId: item.farmerId || `FARMER-${Date.now()}`,
      farmerName: item.farmerName,
      lotId: item.lotId,
      contributedKg: Number(item.contributedKg),
      agreedPricePerKg: item.agreedPricePerKg || 30,
      estimatedNetPerKg: item.estimatedNetPerKg || 28,
      status: 'RESERVED_IN_FPO_BATCH'
    }));

    const newAggregation = store.createAggregation({
      title: title || `FPO Bulk Aggregation (${totalAggregatedKg} kg)`,
      targetBuyerId: targetBuyerId || 'BUYER-A',
      targetBuyerName: targetBuyerName || 'FreshMart Retail Hub',
      targetQuantity: totalAggregatedKg,
      participatingFarmers,
      totalPayoutEst: totalAggregatedKg * 28,
      notes: notes || 'FPO collective fulfillment with separate lot traceability preserved.'
    });

    res.status(201).json({
      success: true,
      message: `Successfully aggregated ${totalAggregatedKg} kg across ${selectedLots.length} farmers`,
      data: newAggregation,
      ruleAdherenceNote: 'Individual Lot IDs and farmer quantities kept strictly separate in digital traceability ledger.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
