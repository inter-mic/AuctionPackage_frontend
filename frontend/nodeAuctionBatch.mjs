
import logger from "./logger.mjs";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wssBatch = new WebSocketServer({ server, path:  "/ws/batch" });

let clientsBatch = [];
wssBatch.on("connection", (ws) => {
  clientsBatch.push(ws);
  logger.info(`現在の接続数: ${clientsBatch.length}`);

  ws.on("close", () => {
    clientsBatch = clientsBatch.filter((c) => c !== ws);
    logger.info(`🔴 接続が切断されました。現在の接続数: ${clientsBatch.length}`);
  });
});

app.post("/auctionDataPush", (req, res) => {
  const data = JSON.stringify(req.body);

  let sentCount = 0;
  clientsBatch.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      sentCount++;
    }
  });
  logger.info(`📤 Sent data to ${sentCount} clients.`);
  res.sendStatus(200);
});

server.listen(3101, () => {
  logger.info("WebSocket relay server running on port 3101");
});
