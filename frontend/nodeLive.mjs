import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_LIVE_ID;
const wsPort = Number(process.env.WS_LIVE_PORT);
const internalPort = Number(process.env.LIVE_INTERNAL_PORT);

logger.info(`Starting live auction service with instance ID: ${nodeId}`);

// ライブオークション固有の状態管理
let connectionCount = 0; // このインスタンスの接続数
let latestData = {}; // 最新のデータを保持

//nodeLive.js内で以下データ保持（毎接続時に送信させる用）
let currntPrice;
let nextPrice;
let kenriPaddleNo;
let isBelowSaiteiPriceFlg;
let isBidDisabled;
let isBidComingSoonMsgFlg;
let isRakusatsuProcessingMsgFlg;
let msg;

// 共通WebSocketサーバーの設定
const liveServer = new CommonWebSocketServer({
  nodeId: nodeId,
  wsPort: wsPort,
  internalPort: internalPort,
  wsPath: "/ws/live",
  serviceName: "Live auction service",
  healthCheckInterval: 10000,
  instanceTimeout: 30000,
  internalToken: process.env.INTERNAL_TOKEN || "",
});

// ライブオークション固有のWebSocket接続処理
liveServer.onWebSocketConnection((ws) => {
  connectionCount++;
  updateMemberConnectionCount();

  // ping/pong用のタイマーを設定
  let pingInterval;
  let pongTimeout;

  const startPingPong = () => {
    // 30秒ごとにpingを送信
    pingInterval = setInterval(() => {
      if (ws.readyState === 1) { // WebSocket.OPEN
        ws.send(JSON.stringify({ type: "ping" }));
        
        // pongが5秒以内に返ってこない場合は接続を切断
        pongTimeout = setTimeout(() => {
          logger.warn("Pong timeout, closing connection");
          ws.close();
        }, 5000);
      }
    }, 30000);
  };

  const stopPingPong = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
    }
    if (pongTimeout) {
      clearTimeout(pongTimeout);
    }
  };

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

    // ping/pong処理
    if (data.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
      return;
    }
    if (data.type === "pong") {
      if (pongTimeout) {
        clearTimeout(pongTimeout);
      }
      return;
    }

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

    // このインスタンスのクライアントにデータを送信
    broadcastToClients(data, commonData);

    // 他のインスタンスにもブロードキャスト
    liveServer.broadcastToOtherInstances(data, commonData);
  });

  ws.on("close", () => {
    stopPingPong();
    if (!ws.isAdmin) {
      connectionCount--; // 非管理者の切断を反映
      updateMemberConnectionCount();
    }
    updateMemberConnectionCount();
  });

  // ping/pongを開始
  startPingPong();
});

  // ライブオークション固有のブロードキャスト処理
  function broadcastToClients(data, commonData) {
    liveServer.getWebSocketClients().forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
      if (data.type === "onlineBid") {
        if (client.isAdmin) {
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
        let payload = { type: data.type, ...commonData, ...data };

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
}

  function updateMemberConnectionCount() {
    liveServer.getWebSocketClients().forEach((client) => {
      if (client.readyState === 1 && client.isAdmin) { // WebSocket.OPEN
        client.send(JSON.stringify({ type: "connectionCount", count: connectionCount }));
      }
    });
  }


// サーバーを開始
liveServer.start();
