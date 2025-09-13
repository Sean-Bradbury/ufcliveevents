import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { scrapeUFC } from "./server";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "custom-middleware",
      configureServer(server) {
        server.middlewares.use("/api/scrape", async (req, res) => {
          try {
            const data = await scrapeUFC();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            res.end(JSON.stringify({ error: "Internal Server Error", details: errorMessage }));
          }
        });
      },
    },
  ],
});