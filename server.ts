import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleCoachChat, handleHealth, handleIdea, handleMessageSuggestion, handleReport } from './server/coach.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  console.log(`Coach IA: ${handleHealth().body.ai}`);

  // Toda a lógica do coach vive em server/coach.ts (a mesma usada no Cloudflare Worker)
  app.post('/api/coach/chat', async (req, res) => {
    const result = await handleCoachChat(req.body);
    res.status(result.status).json(result.body);
  });

  app.post('/api/coach/idea', async (req, res) => {
    const result = await handleIdea(req.body);
    res.status(result.status).json(result.body);
  });

  app.post('/api/coach/message', async (req, res) => {
    const result = await handleMessageSuggestion(req.body);
    res.status(result.status).json(result.body);
  });

  app.post('/api/coach/report', (req, res) => {
    const result = handleReport(req.body);
    res.status(result.status).json(result.body);
  });

  app.get('/api/health', (_req, res) => {
    res.json(handleHealth().body);
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prumo Full-Stack Server running on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
