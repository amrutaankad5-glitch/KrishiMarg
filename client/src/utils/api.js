// Client API connector for KrishiMarg backend
const API_BASE = '/api';

export async function fetchLots() {
  const res = await fetch(`${API_BASE}/crops`);
  return res.json();
}

export async function fetchLotById(id) {
  const res = await fetch(`${API_BASE}/crops/${id}`);
  return res.json();
}

export async function createLot(lotData) {
  const res = await fetch(`${API_BASE}/crops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lotData)
  });
  return res.json();
}

export async function fetchRecommendations(lotId, simulateNoBuyers = false) {
  const url = `${API_BASE}/recommendations/${lotId}${simulateNoBuyers ? '?simulateNoBuyers=true' : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function reserveInventory(lotId, buyerId, quantity, offerData) {
  const res = await fetch(`${API_BASE}/inventory/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lotId, buyerId, quantity, offerData })
  });
  return res.json();
}

export async function cancelInventoryReservation(lotId, reason) {
  const res = await fetch(`${API_BASE}/inventory/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lotId, reason })
  });
  return res.json();
}

export async function addQualityCheckpoint(lotId, checkpointData) {
  const res = await fetch(`${API_BASE}/crops/${lotId}/checkpoints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkpointData)
  });
  return res.json();
}

export async function advanceLotStage(lotId, stage, paymentStatus) {
  const res = await fetch(`${API_BASE}/crops/${lotId}/advance-stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, paymentStatus })
  });
  return res.json();
}

export async function fetchSupplyChain() {
  const res = await fetch(`${API_BASE}/supplychain`);
  return res.json();
}

export async function fetchFpoMembers() {
  const res = await fetch(`${API_BASE}/aggregation/members`);
  return res.json();
}

export async function fetchAggregations() {
  const res = await fetch(`${API_BASE}/aggregation/batches`);
  return res.json();
}

export async function createAggregation(aggData) {
  const res = await fetch(`${API_BASE}/aggregation/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aggData)
  });
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/audit`);
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST'
  });
  return res.json();
}
