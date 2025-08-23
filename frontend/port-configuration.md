# 推奨ポート構成実装例

## ポート構成表

| サービス | WebSocketポート | インスタンス間通信ポート | 用途 |
|---------|----------------|----------------------|------|
| `nodeAuction.mjs` | 3100 | 3110 | アプリケーション用WebSocket |
| `nodeLive.mjs` | 3200 | 3210 | ライブオークション用WebSocket |
| `nodeAuctionBatch.mjs` | 3300 | 3310 | バッチ処理用WebSocket |

## 環境変数設定

### .env ファイル
```bash
# インスタンス設定
INSTANCE_ID=i-xxxxxxxxx
NODE_ENV=production

# Auction Service
AUCTION_WS_PORT=3100
AUCTION_INTERNAL_PORT=3110

# Live Service
LIVE_WS_PORT=3200
LIVE_INTERNAL_PORT=3210

# Batch Service
BATCH_WS_PORT=3300
BATCH_INTERNAL_PORT=3310

# 他のインスタンスリスト
OTHER_INSTANCES=10.0.1.10,10.0.1.11,10.0.1.12
```

## 各ファイルの更新

### nodeAuction.mjs
```javascript
// インスタンス間通信の設定
const WS_PORT = process.env.AUCTION_WS_PORT || 3100;
const INSTANCE_COMMUNICATION_PORT = process.env.AUCTION_INTERNAL_PORT || 3110;

// WebSocketサーバー
const wssApp = new WebSocketServer({ server, path: "/ws/app" });

// HTTPサーバー（WebSocket用）
server.listen(WS_PORT, () => {
  logger.info(`Auction WebSocket service running on port ${WS_PORT} (Instance: ${nodeId})`);
});

// インスタンス間通信用HTTPサーバー
const internalServer = http.createServer(internalApp);
internalServer.listen(INSTANCE_COMMUNICATION_PORT, () => {
  logger.info(`Auction internal service running on port ${INSTANCE_COMMUNICATION_PORT} (Instance: ${nodeId})`);
});
```

### nodeLive.mjs
```javascript
// インスタンス間通信の設定
const WS_PORT = process.env.LIVE_WS_PORT || 3200;
const INSTANCE_COMMUNICATION_PORT = process.env.LIVE_INTERNAL_PORT || 3210;

// WebSocketサーバー
const wssApp = new WebSocketServer({ server, path: "/ws/live" });

// HTTPサーバー（WebSocket用）
server.listen(WS_PORT, () => {
  logger.info(`Live WebSocket service running on port ${WS_PORT} (Instance: ${nodeId})`);
});

// インスタンス間通信用HTTPサーバー
const internalServer = http.createServer(internalApp);
internalServer.listen(INSTANCE_COMMUNICATION_PORT, () => {
  logger.info(`Live internal service running on port ${INSTANCE_COMMUNICATION_PORT} (Instance: ${nodeId})`);
});
```

### nodeAuctionBatch.mjs
```javascript
// インスタンス間通信の設定
const WS_PORT = process.env.BATCH_WS_PORT || 3300;
const INSTANCE_COMMUNICATION_PORT = process.env.BATCH_INTERNAL_PORT || 3310;

// WebSocketサーバー
const wssBatch = new WebSocketServer({ server, path: "/ws/batch" });

// HTTPサーバー（WebSocket用）
server.listen(WS_PORT, () => {
  logger.info(`Batch WebSocket service running on port ${WS_PORT} (Instance: ${nodeId})`);
});

// インスタンス間通信用HTTPサーバー
const internalServer = http.createServer(internalApp);
internalServer.listen(INSTANCE_COMMUNICATION_PORT, () => {
  logger.info(`Batch internal service running on port ${INSTANCE_COMMUNICATION_PORT} (Instance: ${nodeId})`);
});
```

## AWS ALB設定

### ターゲットグループ設定
```json
{
  "TargetGroups": [
    {
      "Name": "auction-app-tg",
      "Protocol": "HTTP",
      "Port": 3100,
      "VpcId": "vpc-xxxxxxxxx",
      "HealthCheckProtocol": "HTTP",
      "HealthCheckPort": "3100",
      "HealthCheckPath": "/health",
      "TargetType": "instance"
    },
    {
      "Name": "auction-live-tg",
      "Protocol": "HTTP", 
      "Port": 3200,
      "VpcId": "vpc-xxxxxxxxx",
      "HealthCheckProtocol": "HTTP",
      "HealthCheckPort": "3200",
      "HealthCheckPath": "/health",
      "TargetType": "instance"
    },
    {
      "Name": "auction-batch-tg",
      "Protocol": "HTTP",
      "Port": 3300,
      "VpcId": "vpc-xxxxxxxxx", 
      "HealthCheckProtocol": "HTTP",
      "HealthCheckPort": "3300",
      "HealthCheckPath": "/health",
      "TargetType": "instance"
    }
  ]
}
```

### リスナー設定
```json
{
  "Listeners": [
    {
      "Protocol": "HTTP",
      "Port": 80,
      "DefaultActions": [
        {
          "Type": "forward",
          "TargetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/auction-app-tg/xxx"
        }
      ]
    },
    {
      "Protocol": "HTTP", 
      "Port": 81,
      "DefaultActions": [
        {
          "Type": "forward",
          "TargetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/auction-live-tg/xxx"
        }
      ]
    },
    {
      "Protocol": "HTTP",
      "Port": 82, 
      "DefaultActions": [
        {
          "Type": "forward",
          "TargetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/auction-batch-tg/xxx"
        }
      ]
    }
  ]
}
```

## セキュリティグループ設定

### インバウンドルール
```bash
# WebSocket用ポート（ALBからのアクセス）
aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3100 \
  --source-group alb-sg

aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3200 \
  --source-group alb-sg

aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3300 \
  --source-group alb-sg

# インスタンス間通信用ポート（同じセキュリティグループ内）
aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3110 \
  --source-group auction-sg

aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3210 \
  --source-group auction-sg

aws ec2 authorize-security-group-ingress \
  --group-name auction-sg \
  --protocol tcp \
  --port 3310 \
  --source-group auction-sg
```

## ヘルスチェック設定

### 統合ヘルスチェックサーバー
```javascript
// health-check.js
const http = require('http');
const axios = require('axios');

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    try {
      // 各サービスのヘルスチェック
      const auctionHealth = await axios.get('http://localhost:3100/health');
      const liveHealth = await axios.get('http://localhost:3200/health');
      const batchHealth = await axios.get('http://localhost:3300/health');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        services: {
          auction: auctionHealth.data,
          live: liveHealth.data,
          batch: batchHealth.data
        },
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  }
});

server.listen(8080, () => {
  console.log('Health check server running on port 8080');
});
```

## 起動スクリプト

### systemd サービスファイル
```ini
# /etc/systemd/system/auction-websocket.service
[Unit]
Description=Auction WebSocket Services
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/auction-system
Environment=NODE_ENV=production
Environment=INSTANCE_ID=i-xxxxxxxxx
ExecStart=/usr/bin/node nodeAuction.mjs
ExecStart=/usr/bin/node nodeLive.mjs
ExecStart=/usr/bin/node nodeAuctionBatch.mjs
ExecStart=/usr/bin/node health-check.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## 監視設定

### CloudWatch メトリクス
```javascript
// 各サービスのメトリクス送信
const metrics = [
  {
    MetricName: 'AuctionConnections',
    Value: auctionClients.length,
    Unit: 'Count',
    Dimensions: [{ Name: 'InstanceId', Value: instanceId }]
  },
  {
    MetricName: 'LiveConnections', 
    Value: liveClients.length,
    Unit: 'Count',
    Dimensions: [{ Name: 'InstanceId', Value: instanceId }]
  },
  {
    MetricName: 'BatchConnections',
    Value: batchClients.length, 
    Unit: 'Count',
    Dimensions: [{ Name: 'InstanceId', Value: instanceId }]
  }
];
```

## トラブルシューティング

### ポート確認コマンド
```bash
# 使用中のポートを確認
sudo netstat -tlnp | grep -E ':(3100|3200|3300|3110|3210|3310)'

# 各サービスのヘルスチェック
curl http://localhost:3100/health
curl http://localhost:3200/health  
curl http://localhost:3300/health

# 統合ヘルスチェック
curl http://localhost:8080/health
```

### ログ確認
```bash
# 各サービスのログ
tail -f /home/ec2-user/auction-system/auction.log
tail -f /home/ec2-user/auction-system/live.log
tail -f /home/ec2-user/auction-system/batch.log
``` 