import express from 'express';
import { registerRoutes } from './routes';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.resolve(__dirname, '../client/dist');

// Parse JSON request bodies
app.use(express.json());

// In development mode, use Vite's dev server
async function startServer() {
  try {
    // Setup routes and get the HTTP server
    const httpServer = registerRoutes(app);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, serve the static files from the dist directory
      app.use(express.static(clientDistDir));
      
      // For all other routes, let the SPA handle routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistDir, 'index.html'));
      });
    } else {
      // In development, proxy to Vite dev server
      const { createServer } = await import('vite');
      
      const vite = await createServer({
        root: 'client',
        server: {
          middlewareMode: true,
          hmr: {
            server: httpServer
          }
        },
        appType: 'spa'
      });
      
      // Use Vite's middlewares
      app.use(vite.middlewares);
    }

    // Start the server
    httpServer.listen(Number(PORT), () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Frontend-only mode enabled`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();