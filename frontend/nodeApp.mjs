import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_APP_ID;
const wsPort = Number(process.env.WS_APP_PORT);
const internalPort = Number(process.env.INTERNAL_APP_PORT);

logger.info(`Starting auction service with instance ID: ${nodeId}`);

// 共通WebSocketサーバーの設定
const appServer = new CommonWebSocketServer({
  nodeId: nodeId,
  wsPort: wsPort,
  internalPort: internalPort,
  wsPath: "/ws/app",
  serviceName: "Auction service",
  healthCheckInterval: 10000,
  instanceTimeout: 30000,
  internalToken: process.env.INTERNAL_TOKEN || "",
});

// サーバーを開始
appServer.start();
