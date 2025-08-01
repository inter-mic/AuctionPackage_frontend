const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wssBatch = new WebSocket.Server({ server, path: "/ws/batch" });

let clientsBatch = [];
wssBatch.on("connection", (ws) => {
  clientsBatch.push(ws);
  console.log(`現在の接続数: ${clientsBatch.length}`);

  ws.on("close", () => {
    clientsBatch = clientsBatch.filter((c) => c !== ws);
    console.log(`🔴 接続が切断されました。現在の接続数: ${clientsBatch.length}`);
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
  console.log(`📤 Sent data to ${sentCount} clients.`);
  res.sendStatus(200);
});

server.listen(3101, () => {
  console.log("WebSocket relay server running on port 3101");
});
