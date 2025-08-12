import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_BATCH_ID;
const wsPort = Number(process.env.WS_BATCH_PORT);
const internalPort = Number(process.env.INTERNAL_BATCH_PORT);

logger.info(`Starting auction batch service with instance ID: ${nodeId}`);

// 共通WebSocketサーバーの設定
const batchServer = new CommonWebSocketServer({
  nodeId: nodeId,
  wsPort: wsPort,
  internalPort: internalPort,
  wsPath: "/ws/batch",
  serviceName: "Auction batch service",
  healthCheckInterval: 10000,
  instanceTimeout: 30000,
  internalToken: process.env.INTERNAL_TOKEN || "",
});

// サーバーを開始
batchServer.start();
