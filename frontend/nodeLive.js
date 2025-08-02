const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wssApp = new WebSocket.Server({ server, path: "/ws/live" });

let latestData = {}; // 最新のデータを保持
let connectionCount = 0; // 接続数をトラッキング

//　nodeLive.js内で以下データ保持（毎接続時に送信させる用）
let currntPrice;
let nextPrice;
let kenriPaddleNo;
let isBelowSaiteiPriceFlg;
let isBidDisabled;
let isBidComingSoonMsgFlg;
let isRakusatsuProcessingMsgFlg;
let msg;

wssApp.on("connection", (ws) => {
  connectionCount++;
  updateMemberConnectionCount();
  if (latestData.type) {
    let payload = { ...latestData };
    payload = {
      ...payload,
      currentPrice: currntPrice,
      nextPrice: nextPrice,
      kenriPaddleNo: kenriPaddleNo,
      isBelowSaiteiPriceFlg: isBelowSaiteiPriceFlg,
      isBidDisabled: isBidDisabled,
      msg: msg,
      isBidComingSoonMsgFlg: isBidComingSoonMsgFlg,
      isRakusatsuProcessingMsgFlg: isRakusatsuProcessingMsgFlg,
    };

    ws.send(JSON.stringify(payload));
  }
  ws.isAdmin = false;
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // 管理者の認証
    if (data.type === "admin") {
      ws.isAdmin = true;
      connectionCount--; // 管理者になったので非管理者から除外
      updateMemberConnectionCount();
    }

    // 共通データを作成
    const commonData = {
      goodsId: data.goodsId,
      lot: data.lot,
      goodsName: data.goodsName,
      goodsImage: data.goodsImage,
    };

    latestData = { ...data };

    // 接続しているすべてのクライアントにデータを送信
    wssApp.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (data.type === "onlineBid") {
          if (client !== ws && client.isAdmin) {
            client.send(
              JSON.stringify({
                type: data.type,
                userId: data.userId,
                paddleNo: data.paddleNo,
                bidPrice: data.bidPrice,
              })
            );
          }
        } else {
          let payload = { type: data.type, ...commonData, ...latestData };

          if (data.type === "clear") {
            // 強制クリア時は以下リセット
            currntPrice = "";
            nextPrice = "";
            kenriPaddleNo = "";
            isBelowSaiteiPriceFlg = "";
            isBidDisabled = true;
            msg = "";
            isBidComingSoonMsgFlg = false;
            isRakusatsuProcessingMsgFlg = false;
          }

          // data内に以下データがあったら保持
          if (data.currentPrice != undefined) {
            currntPrice = data.currentPrice;
          }
          if (data.nextPrice != undefined) {
            nextPrice = data.nextPrice;
          }
          if (data.kenriPaddleNo != undefined) {
            kenriPaddleNo = data.kenriPaddleNo;
          }
          if (data.isBelowSaiteiPriceFlg != undefined) {
            isBelowSaiteiPriceFlg = data.isBelowSaiteiPriceFlg;
          }
          if (data.isBidDisabled != undefined) {
            isBidDisabled = data.isBidDisabled;
          }
          if (data.msg != undefined) {
            msg = data.msg;
          }
          if (data.isBidComingSoonMsgFlg != undefined) {
            isBidComingSoonMsgFlg = data.isBidComingSoonMsgFlg;
          }
          if (data.isRakusatsuProcessingMsgFlg != undefined) {
            isRakusatsuProcessingMsgFlg = data.isRakusatsuProcessingMsgFlg;
          }

          if (data.type != "bidComingSoon" && data.type != "sendMessage") {
            //もうすぐ落札、メッセージ配信以外の時はもうすぐ落札を非表示
            isBidComingSoonMsgFlg = false;
          }

          payload = {
            ...payload,
            currentPrice: currntPrice,
            nextPrice: nextPrice,
            kenriPaddleNo: kenriPaddleNo,
            isBelowSaiteiPriceFlg: isBelowSaiteiPriceFlg,
            isBidDisabled: isBidDisabled,
            msg: msg,
            isBidComingSoonMsgFlg: isBidComingSoonMsgFlg,
            isRakusatsuProcessingMsgFlg: isRakusatsuProcessingMsgFlg,
          };
          client.send(JSON.stringify(payload));
        }
      }
    });
  });

  ws.isAdmin = false;
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "admin") {
      ws.isAdmin = true;
    }
  });

  ws.on("close", () => {
    if (!ws.isAdmin) {
      connectionCount--; // 非管理者の切断を反映
      updateMemberConnectionCount();
    }
    updateMemberConnectionCount();
  });
});

function updateMemberConnectionCount() {
  wssApp.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.isAdmin) {
      client.send(JSON.stringify({ type: "connectionCount", count: connectionCount }));
    }
  });
}
server.listen(3001, () => {
  console.log("WebSocket relay server running on port 3001");
});
