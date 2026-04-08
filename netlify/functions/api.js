import "dotenv/config";
import serverless from "serverless-http";
import { createApp } from "../../createApp.js";

let serverlessHandler;

/** Netlify serverless entry — 모든 경로는 netlify.toml 리다이렉트로 여기로 옴 */
export const handler = async (event, context) => {
  if (!serverlessHandler) {
    const app = await createApp();
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};
