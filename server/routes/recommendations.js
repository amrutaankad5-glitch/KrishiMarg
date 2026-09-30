import express from 'express';
import { store } from '../data/store.js';
import { calculateNetRealization, evaluateRouteScore, generateFarmerRouteView } from '../logic/calculations.js';
import { checkLogisticsFeasibility } from '../logic/feasibilityEngine.js';

const router = express.Router();

// GET recommendations for a lot
router.get('/:lotId', (req, res) => {
  try {
    const lot = store.getLotById(req.params.lotId);
    if (!lot) return res.status(404).json({ success: false, message: 'Lot not found' });

    const simulateNoBuyers = req.query.simulateNoBuyers === 'true';

    if (simulateNoBuyers) {
      return res.json({
        success: true,
        hasBuyers: false,
        title: 'No suitable buyer currently available.',
        suggestions: [
          {
            icon: '📡',
            title: 'Expand search radius',
            actionText: 'Search up to 100 km',
            description: 'Connect with bulk buyers across neighboring talukas/districts.'
          },
          {
            icon: '📅',
            title: 'Extend pickup date',
            actionText: 'Adjust by +2 to +4 days',
            description: 'Allow buyers with upcoming procurement schedules to place bids.'
          },
          {
            icon: '🤝',
            title: 'Ask FPO to aggregate crop',
            actionText: 'Pool with local farmers',
            description: 'Combine your 500 kg with nearby farmers to satisfy institutional 2,000+ kg orders.'
          },
          {
            icon: '🏛️',
            title: 'Try another market / APMC',
            actionText: 'View nearest Mandi benchmark',
            description: 'Check benchmark spot prices at Pune APMC Yard with estimated mandi cess deductions.'
          }
        ]
      });
    }

    const allBuyers = store.getBuyers();

    // Evaluate each buyer route
    const evaluatedRoutes = allBuyers.map(buyer => {
      const netCalc = calculateNetRealization(lot, buyer);
      const scoreData = evaluateRouteScore(lot, buyer, netCalc);
      const feasibility = checkLogisticsFeasibility(lot, buyer);

      return {
        buyerId: buyer.id,
        buyerRaw: buyer,
        netCalc,
        scoreData,
        feasibility
      };
    });

    // Determine best feasible route based on composite score
    const feasibleRoutes = evaluatedRoutes.filter(r => r.scoreData.isFeasible);
    feasibleRoutes.sort((a, b) => b.scoreData.compositeScore - a.scoreData.compositeScore);
    const bestBuyerId = feasibleRoutes[0]?.buyerId;

    // Generate Farmer-friendly views and Admin/Judge detailed views
    const farmerRoutes = evaluatedRoutes.map(route => {
      const isBest = route.buyerId === bestBuyerId;
      const farmerView = generateFarmerRouteView(lot, route.buyerRaw, route.netCalc, route.scoreData, isBest);
      return {
        ...farmerView,
        // Administrative details attached for inspection
        adminDetails: {
          compositeScore: route.scoreData.compositeScore,
          scoreBreakdown: route.scoreData.breakdown,
          costMath: route.netCalc,
          feasibilityMatrix: route.feasibility
        }
      };
    });

    // Reorder so recommended is first
    farmerRoutes.sort((a, b) => {
      if (a.isRecommended) return -1;
      if (b.isRecommended) return 1;
      if (a.isFeasible && !b.isFeasible) return -1;
      if (!a.isFeasible && b.isFeasible) return 1;
      return 0;
    });

    res.json({
      success: true,
      hasBuyers: true,
      lotId: lot.id,
      lotQuantity: lot.quantity,
      crop: lot.crop,
      routes: farmerRoutes,
      meta: {
        badge: 'DEMO DATA',
        calculationPrinciple: 'Higher Price ≠ Higher Farmer Earnings'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
