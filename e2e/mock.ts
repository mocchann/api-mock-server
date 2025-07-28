import { createServer, IncomingMessage, ServerResponse } from "http";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const path = req.url?.split("?")[0];
  if (path === "/graphql") {
    if (req.method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Hello, world!");
    }
  } else {
    res.setHeader("Content-Type", "applicaiton/json");
    res.end();
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
