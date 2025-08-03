const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wssApp = new WebSocket.Server({ server, path: "/ws/app" });
let clientsApp = [];
wssApp.on("connection", (ws) => {
  clientsApp.push(ws);
  console.log(`現在の接続数: ${clientsApp.length}`);
  ws.on("close", () => {
    clientsApp = clientsApp.filter((c) => c !== ws);
    console.log(`🔴 接続が切断されました。現在の接続数: ${clientsApp.length}`);
  });
});

app.post("/auctionDataPush", (req, res) => {
  const data = JSON.stringify(req.body);

  let sentCount = 0;

  clientsApp.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      sentCount++;
    }
  });
  console.log(`📤 Sent data to ${sentCount} clients.`);
  res.sendStatus(200);
});

server.listen(3100, () => {
  console.log("WebSocket relay server running on port 3100");
});
