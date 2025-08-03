import { createServer, IncomingMessage, ServerResponse } from "http";

// モックデータ
const mockUsers = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
  },
];

const mockPosts = [
  {
    id: "1",
    title: "GraphQLについて",
    content: "GraphQLは素晴らしい技術です。",
    authorId: "1",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Next.jsの使い方",
    content: "Next.jsでアプリケーションを作成する方法を紹介します。",
    authorId: "2",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

// GraphQLクエリをパースする関数
function parseGraphQLQuery(body: string) {
  try {
    const parsed = JSON.parse(body);
    return parsed.query;
  } catch {
    return null;
  }
}

// GraphQLレスポンスを生成する関数
function generateGraphQLResponse(query: string) {
  if (query.includes("users")) {
    return {
      data: {
        users: mockUsers.map((user) => ({
          ...user,
          posts: mockPosts.filter((post) => post.authorId === user.id),
        })),
      },
    };
  }

  if (query.includes("posts")) {
    return {
      data: {
        posts: mockPosts.map((post) => ({
          ...post,
          author: mockUsers.find((user) => user.id === post.authorId),
        })),
      },
    };
  }

  return {
    data: {
      users: mockUsers.map((user) => ({
        ...user,
        posts: mockPosts.filter((post) => post.authorId === user.id),
      })),
      posts: mockPosts.map((post) => ({
        ...post,
        author: mockUsers.find((user) => user.id === post.authorId),
      })),
    },
  };
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const path = req.url?.split("?")[0];

  if (path === "/graphql") {
    if (req.method === "GET") {
      // GraphQL Playground用のHTMLを返す
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>GraphQL Playground</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>GraphQL Mock Server</h1>
          <p>このサーバーはモックデータを提供します。</p>
          <h2>利用可能なクエリ:</h2>
          <ul>
            <li>users - ユーザー一覧を取得</li>
            <li>posts - 投稿一覧を取得</li>
          </ul>
        </body>
        </html>
      `);
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const query = parseGraphQLQuery(body);

        if (query) {
          const response = generateGraphQLResponse(query);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.end(JSON.stringify(response));
        } else {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid GraphQL query" }));
        }
      });
    }

    if (req.method === "OPTIONS") {
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.end();
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "404 Not Found" }));
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(
    `🚀 GraphQL Mock Server running at http://localhost:${PORT}/graphql`
  );
});
