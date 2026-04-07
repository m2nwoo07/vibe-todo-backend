import express from "express";
import mongoose from "mongoose";
import todosRouter from "./routers/todosRouter.js";

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/todo-backend";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("연결성공");

  const app = express();

  // Live Server(127.0.0.1:5500) ↔ API(localhost:5000)는 출처가 달라 CORS 필요.
  // fetch에 credentials를 쓰면 Allow-Origin: * 는 무효라서, 요청 Origin을 그대로 반사.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, HEAD, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ ok: true, message: "todo-backend" });
  });

  app.use("/todos", todosRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  });

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
