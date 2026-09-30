import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET traditional supply chain stages analysis
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: store.getSupplyChainStages(),
    comparativeAnalysis: {
      traditionalCumulativeCostPerKg: 11.20,
      traditionalFarmerRealization: '₹16 - ₹18/kg (38% of consumer rupee)',
      krishiMargFarmerRealization: '₹28/kg (70% of consumer rupee)',
      spoilageTraditional: '8% - 14% cumulative waste across 4 handling hubs',
      spoilageKrishiMarg: '1% - 3.5% verified via direct cold/ventilated corridor',
      keyTakeaway: 'KrishiMarg does not blindly eliminate intermediaries. Instead, it identifies where cost exceeds value added and connects farmers directly to verified downstream buyers with transparent physical logistics.'
    },
    meta: {
      badge: 'DEMO DATA',
      methodology: 'Deterministic Value-Added vs Cost-Added Supply Chain Evaluation'
    }
  });
});

export default router;
