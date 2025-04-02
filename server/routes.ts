import { Express } from "express";
import { Server, createServer } from "http";

// We're using a frontend-only approach, so this function mainly
// sets up a server that will handle the frontend routing
export function registerRoutes(app: Express): Server {
  // Add a basic healthcheck endpoint
  app.get('/api/healthcheck', (_req, res) => {
    res.json({ status: 'ok', mode: 'frontend-only' });
  });

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}