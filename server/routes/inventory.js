import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// POST reserve quantity (anti-overselling guard)
router.post('/reserve', (req, res) => {
  try {
    const { lotId, buyerId, quantity, offerData } = req.body;
    if (!lotId || !quantity) {
      return res.status(400).json({ success: false, message: 'lotId and quantity are required' });
    }

    const lot = store.getLotById(lotId);
    if (!lot) return res.status(404).json({ success: false, message: 'Lot not found' });

    const qtyToReserve = Number(quantity);
    if (lot.availableQuantity < qtyToReserve) {
      return res.status(409).json({
        success: false,
        error: 'OVERSELLING_PREVENTED',
        message: `Cannot reserve ${qtyToReserve} kg. Only ${lot.availableQuantity} kg currently available (${lot.reservedQuantity} kg already reserved for another buyer).`,
        currentInventory: {
          totalQuantity: lot.quantity,
          reservedQuantity: lot.reservedQuantity,
          availableQuantity: lot.availableQuantity
        }
      });
    }

    const updatedLot = store.reserveLotQuantity(lotId, buyerId, qtyToReserve);
    if (offerData) {
      updatedLot.acceptedOffer = offerData;
      updatedLot.paymentStatus = 'DEMO PAYMENT STATUS: Pending Pickup & Inspection';
    }

    res.json({
      success: true,
      message: `Successfully reserved ${qtyToReserve} kg for buyer ${buyerId}`,
      data: {
        lotId: updatedLot.id,
        totalQuantity: updatedLot.quantity,
        reservedQuantity: updatedLot.reservedQuantity,
        availableQuantity: updatedLot.availableQuantity,
        assignedBuyerId: updatedLot.assignedBuyerId,
        currentStage: updatedLot.currentStage,
        paymentStatus: updatedLot.paymentStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST cancel reservation (safe rollback)
router.post('/cancel', (req, res) => {
  try {
    const { lotId, reason } = req.body;
    if (!lotId) return res.status(400).json({ success: false, message: 'lotId is required' });

    const lot = store.getLotById(lotId);
    if (!lot) return res.status(404).json({ success: false, message: 'Lot not found' });

    const previousReserved = lot.reservedQuantity;
    const updatedLot = store.cancelReservation(lotId, reason || 'Buyer cancelled this order.');

    res.json({
      success: true,
      message: 'Order cancelled successfully. Reserved inventory restored to available pool.',
      farmerNotification: '⚠️ Buyer cancelled this order.',
      autoActionsTaken: [
        `Released ${previousReserved} kg reserved crop`,
        `Restored available balance to ${updatedLot.availableQuantity} kg`,
        'Recorded cancellation in immutable demo event log',
        'Enabled instant search for alternative buyers'
      ],
      data: {
        lotId: updatedLot.id,
        totalQuantity: updatedLot.quantity,
        reservedQuantity: updatedLot.reservedQuantity,
        availableQuantity: updatedLot.availableQuantity,
        currentStage: updatedLot.currentStage
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
