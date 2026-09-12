import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from dist
    const distPath = path.join(__dirname, '..', 'dist');
    
    // Check if dist exists (handle case where server.cjs is inside dist or outside)
    const servePath = fs.existsSync(distPath) ? distPath : path.join(__dirname, 'dist');
    
    app.use(express.static(servePath));
    
    // SPA Fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(servePath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
