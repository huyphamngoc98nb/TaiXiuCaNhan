import express from 'express';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors({
  origin: '*',
  methods: ['GET'],
}));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'taixiu-api',
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

app.listen(PORT, () => {
  console.log(`[API] Running on http://localhost:${PORT}`);
  console.log(`[API] Health: http://localhost:${PORT}/api/health`);
});

export default app;
