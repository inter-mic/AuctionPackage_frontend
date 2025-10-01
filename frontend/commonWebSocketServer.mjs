import logger from "./logger.mjs";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import axios from "axios";

export class CommonWebSocketServer {
  constructor(config) {
    this.config = {
      nodeId: config.nodeId,
      wsPort: config.wsPort,
      wsPath: config.wsPath,
      serviceName: config.serviceName,
      healthCheckInterval: config.healthCheckInterval || 10000,
      instanceTimeout: config.instanceTimeout || 30000,
      internalToken: config.internalToken || "",
      customEndpoints: config.customEndpoints || [],
      ...config,
    };

    this.app = express();
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server, path: this.config.wsPath });

    this.clients = [];
    this.otherInstances = new Set();
    this.instanceHealthCheck = new Map();
    this.customConnectionHandler = null; // カスタム接続ハンドラー

    this.setupWebSocketHandlers();
    this.setupHttpEndpoints();
    this.setupCustomEndpoints();
    this.setupHealthCheck();
    this.setupGracefulShutdown();
  }

  // カスタムWebSocket接続ハンドラーを設定
  onWebSocketConnection(handler) {
    this.customConnectionHandler = handler;
  }

  setupWebSocketHandlers() {
    this.wss.on("connection", (ws) => {
      this.clients.push(ws);
      logger.info(`現在の接続数: ${this.clients.length} (Instance: ${this.config.nodeId})`);

      // カスタム接続ハンドラーが設定されている場合は実行
      if (this.customConnectionHandler) {
        this.customConnectionHandler(ws);
      }

      ws.on("close", () => {
        this.clients = this.clients.filter((c) => c !== ws);
        logger.info(
          `🔴 接続が切断されました。現在の接続数: ${this.clients.length} (Instance: ${this.config.nodeId})`
        );
      });
    });
  }

  setupHttpEndpoints() {
    // インスタンス間通信用のHTTPエンドポイント
    this.app.post("/instance/broadcast", (req, res) => {
      const { data, sourcenodeId } = req.body;

      if (sourcenodeId === this.config.nodeId) {
        // 自分自身からのブロードキャストは無視
        res.sendStatus(200);
        return;
      }

      logger.info(`Received broadcast from ${sourcenodeId}: ${JSON.stringify(data)}`);

      // このインスタンスのクライアントにメッセージを送信
      this.broadcastToClients(data);

      res.sendStatus(200);
    });

    // インスタンス登録エンドポイント
    this.app.post("/instance/register", (req, res) => {
      const { nodeId: newnodeId, port } = req.body;

      if (newnodeId !== this.config.nodeId) {
        this.otherInstances.add(newnodeId);
        this.instanceHealthCheck.set(newnodeId, Date.now());
        logger.info(`Registered new instance: ${newnodeId} on port ${port}`);
      }

      res.json({
        success: true,
        currentInstance: this.config.nodeId,
        registeredInstances: Array.from(this.otherInstances),
      });
    });

    // インスタンス削除エンドポイント
    this.app.post("/instance/unregister", (req, res) => {
      const { nodeId: removenodeId } = req.body;

      if (removenodeId !== this.config.nodeId) {
        this.otherInstances.delete(removenodeId);
        this.instanceHealthCheck.delete(removenodeId);
        logger.info(`Unregistered instance: ${removenodeId}`);
      }

      res.sendStatus(200);
    });

    // ヘルスチェックエンドポイント
    this.app.get("/health", (req, res) => {
      res.json({
        nodeId: this.config.nodeId,
        status: "healthy",
        connections: this.clients.length,
        otherInstances: Array.from(this.otherInstances),
        timestamp: new Date().toISOString(),
      });
    });

    // インスタンス一覧取得エンドポイント
    this.app.get("/instances", (req, res) => {
      res.json({
        currentInstance: this.config.nodeId,
        allInstances: Array.from(this.otherInstances),
        healthStatus: Object.fromEntries(this.instanceHealthCheck),
      });
    });

    // 既存のauctionDataPushエンドポイント（後方互換性）
    this.app.post("/auctionDataPush", (req, res) => {
      const data = req.body;

      // このインスタンスのクライアントに送信
      this.broadcastToClients(data);

      // 他のインスタンスにもブロードキャスト
      this.broadcastToOtherInstances(data);

      logger.info(
        `📤 Sent data to ${this.clients.length} clients on instance ${this.config.nodeId}`
      );
      res.sendStatus(200);
    });
  }

  setupCustomEndpoints() {
    // カスタムエンドポイントを設定
    this.config.customEndpoints.forEach((endpoint) => {
      const { method, path, handler } = endpoint;
      this.app[method.toLowerCase()](path, handler);
    });
  }

  // カスタムエンドポイントを動的に追加
  addCustomEndpoint(method, path, handler) {
    this.app[method.toLowerCase()](path, handler);
  }

  // クライアントへのブロードキャスト
  broadcastToClients(data) {
    const dataString = JSON.stringify(data);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(dataString);
        sentCount++;
      }
    });

    logger.info(`📤 Sent data to ${sentCount} clients on instance ${this.config.nodeId}`);
  }

  // 他のインスタンスへのブロードキャスト
  async broadcastToOtherInstances(data) {
    const peers = Array.from(this.otherInstances.values());
    const headers = this.config.internalToken
      ? { "X-Internal-Token": this.config.internalToken }
      : undefined;

    const body = {
      data,
      sourcenodeId: this.config.nodeId,
    };

    const promises = peers.map(async (peer) => {
      const url = `http://${peer}:${
        this.config.internalPort || this.config.port
      }/instance/broadcast`;
      try {
        await axios.post(url, body, { timeout: 5000, headers });
        this.instanceHealthCheck.set(peer, Date.now());
        return { nodeId: peer, success: true };
      } catch (error) {
        logger.error(`Failed to broadcast to instance ${peer}: ${error.message}`);
        return { nodeId: peer, success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(promises);
    const ok = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - ok;
    if (failed > 0) logger.warn(`Broadcast results: ${ok} successful, ${failed} failed`);
  }

  // インスタンス発見機能
  async discoverOtherInstances() {
    const otherInstanceList = process.env.OTHER_INSTANCES;

    if (otherInstanceList) {
      const instances = otherInstanceList
        .split(",")
        .filter((id) => id.trim() !== this.config.nodeId);

      for (const nodeId of instances) {
        try {
          const response = await axios.post(
            `http://${nodeId}:${this.config.internalPort || this.config.port}/instance/register`,
            {
              nodeId: nodeId,
              port: this.config.internalPort || this.config.port,
            },
            {
              timeout: 5000,
            }
          );

          if (response.data.success) {
            this.otherInstances.add(nodeId);
            this.instanceHealthCheck.set(nodeId, Date.now());
            logger.info(`Discovered and registered instance: ${nodeId}`);
          }
        } catch (error) {
          logger.warn(`Failed to discover instance ${nodeId}:`, error.message);
        }
      }
    }
  }

  // インスタンスヘルスチェック
  checkInstanceHealth() {
    const now = Date.now();
    const timeoutInstances = [];

    for (const [nodeId, lastSeen] of this.instanceHealthCheck) {
      if (now - lastSeen > this.config.instanceTimeout) {
        timeoutInstances.push(nodeId);
      }
    }

    // タイムアウトしたインスタンスを削除
    timeoutInstances.forEach((nodeId) => {
      this.otherInstances.delete(nodeId);
      this.instanceHealthCheck.delete(nodeId);
      logger.warn(`Instance ${nodeId} timed out and removed`);
    });
  }

  setupHealthCheck() {
    // 定期的なヘルスチェック
    setInterval(() => this.checkInstanceHealth(), this.config.healthCheckInterval);

    // 起動時のインスタンス発見
    setTimeout(() => this.discoverOtherInstances(), 5000);
  }

  setupGracefulShutdown() {
    process.on("SIGTERM", async () => {
      logger.info(`Shutting down instance ${this.config.nodeId}...`);

      // 他のインスタンスに通知
      const promises = Array.from(this.otherInstances).map(async (nodeId) => {
        try {
          await axios.post(
            `http://${nodeId}:${this.config.internalPort || this.config.port}/instance/unregister`,
            {
              nodeId: nodeId,
            },
            {
              timeout: 5000,
            }
          );
        } catch (error) {
          logger.error(`Failed to notify shutdown to ${nodeId}:`, error.message);
        }
      });

      await Promise.allSettled(promises);

      // WebSocket接続を閉じる
      this.wss.clients.forEach((client) => {
        client.close();
      });

      this.server.close(() => {
        logger.info(`Instance ${this.config.nodeId} shutdown complete`);
        process.exit(0);
      });
    });
  }

  // サーバー情報を取得
  getServerInfo() {
    return {
      nodeId: this.config.nodeId,
      wsPort: this.config.wsPort,
      internalPort: this.config.internalPort,
      serviceName: this.config.serviceName,
      connections: this.clients.length,
      otherInstances: Array.from(this.otherInstances),
    };
  }

  // クライアント数を取得
  getClientCount() {
    return this.clients.length;
  }

  // WebSocketクライアントのリストを取得
  getWebSocketClients() {
    return this.clients;
  }

  // 他のインスタンス数を取得
  getOtherInstanceCount() {
    return this.otherInstances.size;
  }

  start() {
    this.server.listen(this.config.wsPort, () => {
      logger.info(
        `${this.config.serviceName} WebSocket running on port ${this.config.wsPort} (Instance: ${this.config.nodeId})`
      );
    });

    // 内部通信用のHTTPサーバーも起動
    if (this.config.internalPort && this.config.internalPort !== this.config.wsPort) {
      const internalServer = http.createServer(this.app);
      internalServer.listen(this.config.internalPort, () => {
        logger.info(
          `${this.config.serviceName} internal communication running on port ${this.config.internalPort} (Instance: ${this.config.nodeId})`
        );
      });
    }
  }
}
