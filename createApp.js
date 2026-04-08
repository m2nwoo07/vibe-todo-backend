import express from "express";
import mongoose from "mongoose";
import todosRouter from "./routers/todosRouter.js";

const MONGODB_URI =
  process.env.MONGODB_URI ??
  process.env.MONGO_URL ??
  "mongodb://127.0.0.1:27017/todo-backend";

async function ensureMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
  console.log("연결성공");
}

let appInstance = null;

export async function createApp() {
  await ensureMongo();
  if (appInstance) return appInstance;

  const app = express();

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

  appInstance = app;
  return app;
}
