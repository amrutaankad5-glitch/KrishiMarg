import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cropsRouter from './routes/crops.js';
import recommendationsRouter from './routes/recommendations.js';
import inventoryRouter from './routes/inventory.js';
import aggregationRouter from './routes/aggregation.js';
import supplyChainRouter from './routes/supplyChain.js';
import { store } from './data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Static client assets
app.use(express.static(clientDistPath));

// Routes
app.use('/api/crops', cropsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/aggregation', aggregationRouter);
app.use('/api/supplychain', supplyChainRouter);

// Audit logs & Traceability
app.get('/api/audit', (req, res) => {
  res.json({
    success: true,
    data: store.getAuditLogs(),
    meta: { badge: 'RECORDED DEMO EVENT' }
  });
});

// Buyers list
app.get('/api/buyers', (req, res) => {
  res.json({
    success: true,
    data: store.getBuyers(),
    meta: { badge: 'DEMO DATA' }
  });
});

// Global reset
app.post('/api/reset', (req, res) => {
  store.reset();
  res.json({
    success: true,
    message: 'KrishiMarg state reset to factory seed demo data successfully.',
    meta: { badge: 'RECORDED DEMO EVENT' }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'KrishiMarg Engine',
    timestamp: new Date().toISOString()
  });
});

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[KrishiMarg Engine] Running on http://localhost:${PORT}`);
});

