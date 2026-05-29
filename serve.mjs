import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 4187);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
    const requestPath = decodeURIComponent(requestUrl.pathname);
    const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const resolvedPath = path.join(__dirname, normalizedPath === "/" ? "index.html" : normalizedPath);

    if (!resolvedPath.startsWith(__dirname)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    const file = await readFile(resolvedPath);
    const extension = path.extname(resolvedPath).toLowerCase();

    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
