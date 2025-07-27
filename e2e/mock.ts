import { createServer, IncomingMessage, ServerResponse } from "http";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, world!");
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
