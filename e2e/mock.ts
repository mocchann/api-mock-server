import { createServer, IncomingMessage, ServerResponse } from "http";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const path = req.url?.split("?")[0];
  if (path === "/graphql") {
    if (req.method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end("Hello, world!");
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.end("404 Not Found");
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
