import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dashboardRoutes from './routes/dashboard.js';
import supportRoutes from './routes/support.js';
import teamChatRoutes from './routes/teamChat.js';
import farmRoutes from './routes/farm.js';
import chatRoutes from './routes/chat.js';
import cropRoutes from './routes/crops.js';
import animalRoutes from './routes/animals.js';
import geminiRoutes from './routes/gemini.js';
import reportsRoutes from './routes/reports.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/team-chat', teamChatRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Agrivision Backend is running' });
});

// For Vercel, we DO NOT want to listen on a port or start Vite.
// Vercel serverless will instead import this `app` directly.
if (!process.env.VERCEL) {
  async function startLocalServer() {
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  startLocalServer();
}

export default app;
