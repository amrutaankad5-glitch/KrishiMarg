// In-memory data store with state manipulation and reset capabilities
import { initialLots, buyersDatabase, traditionalSupplyChainStages, fpoMembers } from './seedData.js';

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    // Deep clone to prevent mutating initial state
    this.lots = JSON.parse(JSON.stringify(initialLots));
    this.buyers = JSON.parse(JSON.stringify(buyersDatabase));
    this.supplyChainStages = JSON.parse(JSON.stringify(traditionalSupplyChainStages));
    this.fpoMembers = JSON.parse(JSON.stringify(fpoMembers));
    this.aggregations = [
      {
        id: 'AGG-2026-001',
        title: 'Pune Retail Bulk Aggregation #1',
        targetBuyerId: 'BUYER-A',
        targetBuyerName: 'FreshMart Retail Hub',
        targetQuantity: 500, // kg
        status: 'READY_FOR_DISPATCH',
        createdAt: '2026-09-08T09:00:00Z',
        participatingFarmers: [
          {
            farmerId: 'FARMER-001',
            farmerName: 'Ramesh Patel',
            lotId: 'LOT-TOM-001',
            contributedKg: 300,
            agreedPricePerKg: 30,
            estimatedNetPerKg: 28,
            status: 'RESERVED'
          },
          {
            farmerId: 'FARMER-002',
            farmerName: 'Tukaram Jagtap',
            lotId: 'LOT-TOM-002',
            contributedKg: 200,
            agreedPricePerKg: 30,
            estimatedNetPerKg: 28,
            status: 'RESERVED'
          }
        ],
        totalPayoutEst: 14000,
        notes: 'Merged two smallholder tomato lots for single 500kg EcoVan pickup. Individual traceability preserved.'
      }
    ];
    this.auditLogs = [
      {
        id: 'AUD-001',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_INITIALIZED',
        actor: 'KrishiMarg Core Engine',
        badge: 'RECORDED DEMO EVENT',
        details: 'System seeded with LOT-TOM-001, Buyer A (FreshMart) and Buyer B (Metro Agro).'
      }
    ];
  }

  // Crop Lot Methods
  getLots() {
    return this.lots;
  }

  getLotById(id) {
    return this.lots.find(l => l.id === id);
  }

  addLot(lotData) {
    const newLot = {
      id: lotData.id || `LOT-${(lotData.crop || 'CRP').substring(0, 3).toUpperCase()}-${String(this.lots.length + 1).padStart(3, '0')}`,
      farmerName: lotData.farmerName || 'Ramesh Patel',
      farmerPhone: lotData.farmerPhone || '+91 98765 43210',
      location: lotData.location || 'Khed Village, Pune',
      crop: lotData.crop || 'Tomato',
      variety: lotData.variety || 'Standard Hybrid',
      quantity: Number(lotData.quantity) || 500,
      reservedQuantity: 0,
      availableQuantity: Number(lotData.quantity) || 500,
      readyDate: lotData.readyDate || 'Next week',
      perishability: (lotData.crop || '').toLowerCase().includes('tomato') ? 'HIGH' : 'MEDIUM',
      initialGrade: lotData.initialGrade || 'Grade A — Farmer Declared',
      currentStage: 'REGISTERED',
      assignedBuyerId: null,
      acceptedOffer: null,
      paymentStatus: 'DEMO PAYMENT STATUS: Not Initiated',
      checkpoints: [
        {
          id: `CHK-${Date.now()}-1`,
          stage: 'REGISTRATION',
          title: 'Initial Farmer Declaration',
          declaredGrade: lotData.initialGrade || 'Grade A',
          status: 'FARMER DECLARED',
          damagedPercent: 0,
          affectedKg: 0,
          inspector: `Self Declared by Farmer (${lotData.farmerName || 'Ramesh Patel'})`,
          location: lotData.location || 'Farm Gate',
          timestamp: new Date().toISOString(),
          notes: 'Crop registered via KrishiMarg Farmer Portal'
        }
      ],
      traceabilityEvents: [
        {
          id: `TRC-${Date.now()}-1`,
          type: 'FARM_REGISTRATION',
          title: '🌾 Farm Registration',
          actor: lotData.farmerName || 'Farmer Ramesh Patel',
          location: lotData.location || 'Farm Gate',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'RECORDED DEMO EVENT',
          details: `Crop registered: ${lotData.quantity}kg ${lotData.crop}. Grade A declared.`
        }
      ]
    };
    this.lots.unshift(newLot);
    this.addAudit('LOT_REGISTERED', newLot.farmerName, `Registered ${newLot.quantity}kg of ${newLot.crop} (ID: ${newLot.id})`);
    return newLot;
  }

  updateLot(id, updates) {
    const lot = this.getLotById(id);
    if (!lot) return null;
    Object.assign(lot, updates);
    return lot;
  }

  // Inventory reservation logic
  reserveLotQuantity(lotId, buyerId, quantity) {
    const lot = this.getLotById(lotId);
    if (!lot) throw new Error('Lot not found');
    const qtyToReserve = Number(quantity);

    if (lot.availableQuantity < qtyToReserve) {
      throw new Error(`Insufficient inventory: Only ${lot.availableQuantity} kg available, tried to reserve ${qtyToReserve} kg.`);
    }

    lot.reservedQuantity += qtyToReserve;
    lot.availableQuantity -= qtyToReserve;
    lot.assignedBuyerId = buyerId;
    lot.currentStage = 'OFFER_ACCEPTED';
    
    // Add traceability event
    lot.traceabilityEvents.push({
      id: `TRC-${Date.now()}`,
      type: 'INVENTORY_RESERVED',
      title: '🔒 Inventory Reserved',
      actor: 'KrishiMarg Reservation Engine',
      location: lot.location,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'RECORDED DEMO EVENT',
      details: `${qtyToReserve} kg reserved for Buyer (${buyerId}). Available balance: ${lot.availableQuantity} kg.`
    });

    this.addAudit('INVENTORY_RESERVED', 'System', `Reserved ${qtyToReserve} kg for lot ${lotId} to buyer ${buyerId}`);
    return lot;
  }

  cancelReservation(lotId, reason = 'Buyer cancelled request') {
    const lot = this.getLotById(lotId);
    if (!lot) throw new Error('Lot not found');

    const releasedQty = lot.reservedQuantity;
    lot.availableQuantity += lot.reservedQuantity;
    lot.reservedQuantity = 0;
    lot.assignedBuyerId = null;
    lot.acceptedOffer = null;
    lot.currentStage = 'CANCELLED';

    lot.traceabilityEvents.push({
      id: `TRC-${Date.now()}`,
      type: 'RESERVATION_CANCELLED',
      title: '⚠️ Order Cancelled & Inventory Released',
      actor: 'KrishiMarg Safe-Rollback Manager',
      location: lot.location,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'RECORDED DEMO EVENT',
      details: `${reason}. Fully released ${releasedQty} kg back to available inventory. Instant re-matching enabled.`
    });

    this.addAudit('ORDER_CANCELLED', 'Buyer / System', `Order cancelled on ${lotId}. Released ${releasedQty} kg.`);
    return lot;
  }

  // Progress stage
  advanceLotStage(lotId, nextStage, extraData = {}) {
    const lot = this.getLotById(lotId);
    if (!lot) throw new Error('Lot not found');
    lot.currentStage = nextStage;
    if (extraData.paymentStatus) {
      lot.paymentStatus = extraData.paymentStatus;
    }
    if (extraData.newCheckpoint) {
      lot.checkpoints.push(extraData.newCheckpoint);
    }
    if (extraData.newTraceEvent) {
      lot.traceabilityEvents.push(extraData.newTraceEvent);
    }
    this.addAudit('STAGE_ADVANCED', 'System', `Lot ${lotId} transitioned to ${nextStage}`);
    return lot;
  }

  // Audit
  addAudit(action, actor, details) {
    this.auditLogs.unshift({
      id: `AUD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      badge: 'RECORDED DEMO EVENT',
      details
    });
  }

  getAuditLogs() {
    return this.auditLogs;
  }

  getBuyers() {
    return this.buyers;
  }

  getSupplyChainStages() {
    return this.supplyChainStages;
  }

  getAggregations() {
    return this.aggregations;
  }

  createAggregation(data) {
    const agg = {
      id: `AGG-${Date.now()}`,
      title: data.title || 'FPO Regional Aggregation',
      targetBuyerId: data.targetBuyerId,
      targetBuyerName: data.targetBuyerName,
      targetQuantity: data.targetQuantity,
      status: 'ASSEMBLED',
      createdAt: new Date().toISOString(),
      participatingFarmers: data.participatingFarmers || [],
      totalPayoutEst: data.totalPayoutEst || 0,
      notes: data.notes || 'Consolidated multi-farmer lots for wholesale fulfillment while preserving individual lots.'
    };
    this.aggregations.unshift(agg);
    this.addAudit('FPO_AGGREGATION_CREATED', 'FPO Administrator', `Created batch ${agg.id} for ${agg.targetQuantity} kg`);
    return agg;
  }
}

export const store = new DataStore();
