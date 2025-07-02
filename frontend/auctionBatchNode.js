const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const server = http.createServer(app);

// WebSocketサーバーを2つ作成（ポートは共通、pathが異なる）
const wssBatch = new WebSocket.Server({ server, path: "/ws/batch" });

let clientsBatch = [];

wssBatch.on("connection", (ws) => {
  clientsBatch.push(ws);
  console.log("🟣 /ws/batch connected");
  ws.on("close", () => {
    clientsBatch = clientsBatch.filter((c) => c !== ws);
  });
});

app.post("/auctionDataPush", (req, res) => {
  const data = JSON.stringify(req.body);

  clientsBatch.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });

  res.sendStatus(200);
});

server.listen(3101, () => {
  console.log("WebSocket relay server running on port 3100");
});
