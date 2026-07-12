import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve Service Worker with no-cache headers to ensure immediate updates on browser release
  app.get("/sw.js", (req, res) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Content-Type": "application/javascript"
    });
    res.sendFile(path.resolve(distPath, "sw.js"));
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    try {
      let html = await fs.promises.readFile(indexPath, "utf-8");
      if (req.originalUrl.startsWith("/main-admin")) {
        html = html.replace(
          /href=["']\/manifest\.json["']/,
          'href="/manifest-admin.json"'
        );
      }
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (err) {
      res.sendFile(indexPath);
    }
  });
}
