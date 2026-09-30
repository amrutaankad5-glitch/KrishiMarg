// KrishiMarg Seed Data
export const initialLots = [
  {
    id: 'LOT-TOM-001',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98765 43210',
    location: 'Khed Village, Pune District, Maharashtra',
    crop: 'Tomato',
    variety: 'Vaibhav Hybrid',
    quantity: 500, // kg
    reservedQuantity: 0,
    availableQuantity: 500,
    readyDate: 'Next week',
    perishability: 'HIGH',
    initialGrade: 'Grade A — Farmer Declared',
    currentStage: 'REGISTERED', // REGISTERED, OFFER_ACCEPTED, INVENTORY_RESERVED, PICKUP_SCHEDULED, PICKUP_COMPLETED, IN_TRANSIT, DELIVERED, QUALITY_REVIEW, PAYMENT_PENDING, COMPLETED, CANCELLED
    assignedBuyerId: null,
    acceptedOffer: null,
    paymentStatus: 'DEMO PAYMENT STATUS: Not Initiated',
    checkpoints: [
      {
        id: 'CHK-01',
        stage: 'REGISTRATION',
        title: 'Initial Farmer Declaration',
        declaredGrade: 'Grade A',
        status: 'FARMER DECLARED',
        damagedPercent: 0,
        affectedKg: 0,
        inspector: 'Self Declared by Farmer (Ramesh Patel)',
        location: 'Farm Gate, Khed',
        timestamp: '2026-09-08T08:00:00Z',
        notes: 'Red, firm, harvested at breaker stage. 500 kg total lot.'
      },
      {
        id: 'CHK-02',
        stage: 'PICKUP',
        title: 'Farm-Gate Pickup Inspection',
        declaredGrade: 'Grade A',
        status: 'INSPECTED & APPROVED',
        damagedPercent: 2,
        affectedKg: 10,
        inspector: 'EcoVan Field Logistics Partner',
        location: 'Farm Gate Loading Dock, Khed',
        timestamp: '2026-09-09T09:30:00Z',
        notes: 'Good condition, uniform grading. Minor 2% transit sorting damage accounted for.'
      },
      {
        id: 'CHK-03',
        stage: 'DELIVERY',
        title: 'Destination Delivery Audit',
        declaredGrade: 'Grade B',
        status: 'DISCREPANCY FLAGGED',
        damagedPercent: 5,
        affectedKg: 25,
        inspector: 'FreshMart Receiving Quality Officer',
        location: 'FreshMart Central Dock, Pune',
        timestamp: '2026-09-09T14:45:00Z',
        notes: 'Minor crushing observed in bottom crates during final unloading. 25 kg affected. Quality review initiated. No automated fault assigned.'
      }
    ],
    traceabilityEvents: [
      {
        id: 'TRC-101',
        type: 'FARM_REGISTRATION',
        title: '🌾 Farm Registration',
        actor: 'Farmer Ramesh Patel',
        location: 'Khed Farm #12',
        timestamp: '2026-09-08 08:30 AM',
        badge: 'RECORDED DEMO EVENT',
        details: 'Crop lot LOT-TOM-001 registered. 500 kg Vaibhav Tomato. Grade A declared.'
      },
      {
        id: 'TRC-102',
        type: 'COLLECTION_PICKUP',
        title: '📦 Farm Gate Pickup & Loading',
        actor: 'EcoVan Logistics (Driver: Santosh Shinde)',
        location: 'Khed, Pune',
        timestamp: '2026-09-09 09:30 AM',
        badge: 'RECORDED DEMO EVENT',
        details: 'Vehicle MH-12-Q-4491 loaded. Handled with plastic ventilated crates. Quality Grade A.'
      },
      {
        id: 'TRC-103',
        type: 'IN_TRANSIT',
        title: '🚚 Cold/Ventilated Transit',
        actor: 'EcoVan Fleet GPS Tag #EV-220',
        location: 'NH-60 Corridor (Distance: 20 km)',
        timestamp: '2026-09-09 11:15 AM',
        badge: 'RECORDED DEMO EVENT',
        details: 'Transit time: 55 mins. Ambient temp 24°C monitored.'
      },
      {
        id: 'TRC-104',
        type: 'BUYER_RECEIPT',
        title: '🏪 Retail Hub Dock Arrival',
        actor: 'FreshMart Dock Inspector (Kavita Deshmukh)',
        location: 'Pune Retail Distribution Center',
        timestamp: '2026-09-09 01:30 PM',
        badge: 'RECORDED DEMO EVENT',
        details: 'Unloaded at Bay #4. 475 kg intact Grade A, 25 kg classified Grade B.'
      },
      {
        id: 'TRC-105',
        type: 'PAYMENT_CLEARANCE',
        title: '💰 Direct Settlement',
        actor: 'KrishiMarg Escrow System',
        location: 'Digital Clearing',
        timestamp: '2026-09-09 03:00 PM',
        badge: 'RECORDED DEMO EVENT',
        details: 'DEMO PAYMENT STATUS: ₹14,000 cleared to Farmer Ramesh Patel Bank A/C (Ref: DEMO-TXN-8841).'
      }
    ]
  },
  {
    id: 'LOT-POT-002',
    farmerName: 'Suresh Kumar',
    farmerPhone: '+91 94220 11223',
    location: 'Manchar, Pune',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    quantity: 300,
    reservedQuantity: 0,
    availableQuantity: 300,
    readyDate: 'Immediate',
    perishability: 'LOW',
    initialGrade: 'Grade A — Farmer Declared',
    currentStage: 'REGISTERED',
    assignedBuyerId: null,
    acceptedOffer: null,
    paymentStatus: 'DEMO PAYMENT STATUS: Not Initiated',
    checkpoints: [],
    traceabilityEvents: []
  },
  {
    id: 'LOT-ONI-003',
    farmerName: 'Anand Shinde',
    farmerPhone: '+91 97654 99887',
    location: 'Junnar, Pune',
    crop: 'Onion',
    variety: 'Nashik Red',
    quantity: 200,
    reservedQuantity: 0,
    availableQuantity: 200,
    readyDate: 'Next week',
    perishability: 'MEDIUM',
    initialGrade: 'Grade A — Farmer Declared',
    currentStage: 'REGISTERED',
    assignedBuyerId: null,
    acceptedOffer: null,
    paymentStatus: 'DEMO PAYMENT STATUS: Not Initiated',
    checkpoints: [],
    traceabilityEvents: []
  }
];

export const buyersDatabase = [
  {
    id: 'BUYER-A',
    name: 'FreshMart Retail Hub',
    entityType: 'Verified Local Retailer Chain',
    location: 'Pune Suburb (20 km from Khed)',
    distanceKm: 20,
    offeredPricePerKg: 30, // ₹30/kg
    pickupTiming: 'Tomorrow morning (within 24 hours)',
    pickupDelayHours: 18,
    reliability: {
      isVerified: true,
      completedTransactions: 25,
      cancelledTransactions: 0,
      pickupCompletionRate: 100, // %
      paymentHistory: 'Same-day payment (Within 4 hours of delivery)',
      reputationScore: 96,
      badge: 'Trusted buyer',
      badgeColor: 'green',
      statusNote: 'Consistent on-time payments across 25 verified farmers'
    },
    logistics: {
      feasible: true,
      whoPicksUp: 'Buyer arranged dedicated pickup partner',
      whoProvidesVehicle: 'EcoVan 1.5T Ventilated Mini-Truck (MH-12-Q-4491)',
      whoLoads: 'Transporter helper crew + Farm Gate loader',
      whoTransports: 'EcoVan Agri-Logistics Fleet',
      whoUnloads: 'FreshMart Central Intake Bay',
      storageNeeded: false,
      storageAvailable: true,
      pickupTimeEst: '09:30 AM Tomorrow',
      deliveryTimeEst: '12:30 PM Tomorrow',
      transitTimeHours: 1.5,
      costBreakdownPerKg: {
        transport: 1.00,
        handling: 0.40,
        storage: 0.00,
        packaging: 0.30,
        spoilage: 0.30 // 1% estimated loss due to 20km quick transit
      }
    }
  },
  {
    id: 'BUYER-B',
    name: 'Metro Agro Wholesaler',
    entityType: 'Regional Wholesale Mandi Merchant',
    location: 'Mumbai APMC Terminal (150 km from Khed)',
    distanceKm: 150,
    offeredPricePerKg: 33, // ₹33/kg - Higher nominal price!
    pickupTiming: 'In 3 days',
    pickupDelayHours: 72,
    reliability: {
      isVerified: false,
      completedTransactions: 2,
      cancelledTransactions: 1,
      pickupCompletionRate: 67,
      paymentHistory: 'Payment history unknown (Typically 7-14 days credit)',
      reputationScore: 52,
      badge: 'Limited history',
      badgeColor: 'yellow',
      statusNote: 'Recently registered buyer; payment timeliness not yet established'
    },
    logistics: {
      feasible: true,
      whoPicksUp: 'Third-party open carrier arranged by buyer',
      whoProvidesVehicle: 'Open Body Tata 407 (Third Party)',
      whoLoads: 'Farmer must arrange 2 loading laborers',
      whoTransports: 'Inter-district highway trucker',
      whoUnloads: 'Mandi porter union at terminal',
      storageNeeded: true,
      storageAvailable: true,
      pickupTimeEst: 'Day 3, Afternoon',
      deliveryTimeEst: 'Day 4, Early Morning',
      transitTimeHours: 6.5,
      costBreakdownPerKg: {
        transport: 3.50,
        handling: 1.20,
        storage: 0.80,
        packaging: 0.50,
        spoilage: 1.00 // 3.5% estimated spoilage due to 3-day wait + 150km non-refrigerated transit
      }
    }
  },
  {
    id: 'BUYER-C',
    name: 'Sahyadri Mega Exports',
    entityType: 'Export Broker',
    location: 'JNPT Port Logistics Park (190 km)',
    distanceKm: 190,
    offeredPricePerKg: 40,
    pickupTiming: 'Next week',
    pickupDelayHours: 120,
    reliability: {
      isVerified: true,
      completedTransactions: 14,
      cancelledTransactions: 2,
      pickupCompletionRate: 85,
      paymentHistory: '15-day bank transfer',
      reputationScore: 78,
      badge: 'Verified exporter',
      badgeColor: 'blue',
      statusNote: 'Good track record, but requires strict cold-chain compliance'
    },
    logistics: {
      feasible: false,
      infeasibilityReason: 'No refrigerated transport vehicle available on this corridor. Perishable tomatoes will decay before delivery.',
      whoPicksUp: 'Not available',
      whoProvidesVehicle: 'None assigned',
      whoLoads: 'N/A',
      whoTransports: 'N/A',
      whoUnloads: 'N/A',
      storageNeeded: true,
      storageAvailable: false,
      pickupTimeEst: 'Uncertain',
      deliveryTimeEst: 'Uncertain',
      transitTimeHours: 8,
      costBreakdownPerKg: {
        transport: 6.00,
        handling: 2.00,
        storage: 2.50,
        packaging: 1.50,
        spoilage: 5.00
      }
    }
  }
];

export const traditionalSupplyChainStages = [
  {
    stageNumber: 1,
    name: 'Farmer (Farm Gate)',
    operator: 'Ramesh Patel',
    role: 'Cultivator & Producer',
    serviceProvided: 'Cultivation, harvesting, basic farm-gate sorting',
    priceAtStage: '₹16 - ₹18/kg',
    directCostIncurred: '₹14/kg (Seeds, fertilizer, irrigation, labor)',
    timeSpent: '85 - 90 days crop cycle',
    valueAddedSummary: 'High physical value creation; bears 100% production risk',
    classification: 'ESSENTIAL',
    classificationDetail: 'The indispensable producer of food.'
  },
  {
    stageNumber: 2,
    name: 'Village Trader / Aggregator',
    operator: 'Local Khed Kachha Arhatia',
    role: 'Micro-Aggregator & Immediate Cash Provider',
    serviceProvided: 'Aggregates 5-10 smallholder farmer outputs into single tempo; provides immediate emergency cash credit',
    priceAtStage: '₹21/kg',
    directCostIncurred: '₹1.50/kg (Tempo freight to APMC, weighing, gunny bags)',
    timeSpent: '4 - 12 hours',
    valueAddedSummary: 'Provides vital liquidity and micro-collection for farmers lacking transport',
    classification: 'ESSENTIAL',
    classificationDetail: 'Adds real physical aggregation and credit value for marginal farmers, but charges high implicit interest.'
  },
  {
    stageNumber: 3,
    name: 'APMC Wholesaler / Commission Agent',
    operator: 'Pune APMC Yard Merchant',
    role: 'Wholesale Auctioneer',
    serviceProvided: 'Physical Mandi space, open outcry auction, weighing, APMC user cess',
    priceAtStage: '₹26/kg',
    directCostIncurred: '₹2.20/kg (Mandi cess 1.5%, handling porters, unloading charge)',
    timeSpent: '12 - 24 hours',
    valueAddedSummary: 'Price discovery mechanism and bulk volume clearing',
    classification: 'POTENTIALLY DUPLICATIVE',
    classificationDetail: 'When direct farmer-to-buyer contracts with transparent grading exist, physical mandi offloading and re-loading adds cost without quality improvement.'
  },
  {
    stageNumber: 4,
    name: 'Secondary Distributor / Inter-city Broker',
    operator: 'Sub-Distributor Network',
    role: 'Wholesale to Retail Distributive Logistics',
    serviceProvided: 'Re-bagging into 20kg crates, non-refrigerated highway truck transport to city centers',
    priceAtStage: '₹32/kg',
    directCostIncurred: '₹3.00/kg (Freight, handling, toll, night driver fees)',
    timeSpent: '18 - 36 hours',
    valueAddedSummary: 'Spatial redistribution to consumer consumption clusters',
    classification: 'HIGH COST',
    classificationDetail: 'Repeated manual tossing and lack of temperature control results in 6-10% post-harvest spoilage.'
  },
  {
    stageNumber: 5,
    name: 'Urban Retailer / Kirana / Push-cart Vendor',
    operator: 'Local City Green Grocer',
    role: 'Last-mile Consumer Access',
    serviceProvided: 'Consumer unit sales (500g - 2kg), fine grading, shelf display, end-of-day markdown risk',
    priceAtStage: '₹40 - ₹45/kg',
    directCostIncurred: '₹4.50/kg (Shop rent, 8-12% perishability waste, polythene packaging)',
    timeSpent: '12 - 24 hours on shelf',
    valueAddedSummary: 'Immediate neighborhood access and credit to consumers',
    classification: 'ESSENTIAL',
    classificationDetail: 'Last-mile availability and consumer unit sorting cannot be eliminated.'
  }
];

export const fpoMembers = [
  {
    id: 'FARMER-001',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    village: 'Khed',
    crop: 'Tomato',
    quantity: 300,
    declaredGrade: 'Grade A',
    lotId: 'LOT-TOM-001'
  },
  {
    id: 'FARMER-002',
    name: 'Tukaram Jagtap',
    phone: '+91 91234 56789',
    village: 'Chakan',
    crop: 'Tomato',
    quantity: 200,
    declaredGrade: 'Grade A',
    lotId: 'LOT-TOM-002'
  },
  {
    id: 'FARMER-003',
    name: 'Sunita Bhosale',
    phone: '+91 99887 76655',
    village: 'Manchar',
    crop: 'Tomato',
    quantity: 400,
    declaredGrade: 'Grade B',
    lotId: 'LOT-TOM-004'
  }
];
