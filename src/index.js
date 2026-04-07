import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.url === "/" && req.method === "GET") {
    res.end(JSON.stringify({ ok: true, message: "todo-backend" }));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
