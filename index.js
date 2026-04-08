import "dotenv/config";
import { createApp } from "./createApp.js";

const PORT = Number(process.env.PORT) || 5000;

async function main() {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
