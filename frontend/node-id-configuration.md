# NODE_ID分離設定ガイド

## 推奨構成

### 環境変数設定

#### .env.local
```bash
# 共通設定
NODE_ENV=production
INTERNAL_TOKEN=your-secret-token

# 各サービスのNODE_ID
NODE_APP_ID=app-instance-001
NODE_LIVE_ID=live-instance-001
NODE_BATCH_ID=batch-instance-001

# 各サービスのポート設定
WS_APP_PORT=3100
NODE_APP_PORT=3101

WS_LIVE_PORT=3200
LIVE_INTERNAL_PORT=3210

WS_BATCH_PORT=3300
BATCH_INTERNAL_PORT=3310

# 他のインスタンスリスト（サービス別）
OTHER_APP_INSTANCES=app-instance-002,app-instance-003
OTHER_LIVE_INSTANCES=live-instance-002,live-instance-003
OTHER_BATCH_INSTANCES=batch-instance-002,batch-instance-003
```

### 各ファイルの設定

#### nodeApp.mjs
```javascript
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_APP_ID || `app-instance-${Date.now()}`;
const wsPort = Number(process.env.WS_APP_PORT) || 3100;
const internalPort = Number(process.env.NODE_APP_PORT) || 3101;

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
```

#### nodeLive.mjs
```javascript
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_LIVE_ID || `live-instance-${Date.now()}`;
const wsPort = Number(process.env.WS_LIVE_PORT) || 3200;
const internalPort = Number(process.env.LIVE_INTERNAL_PORT) || 3210;

logger.info(`Starting live auction service with instance ID: ${nodeId}`);

// ライブオークション固有の状態管理
let connectionCount = 0;
let latestData = {};

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
  // ... 既存の処理
});

// サーバーを開始
liveServer.start();
```

#### nodeBatch.mjs
```javascript
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import logger from "./logger.mjs";
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const nodeId = process.env.NODE_BATCH_ID || `batch-instance-${Date.now()}`;
const wsPort = Number(process.env.WS_BATCH_PORT) || 3300;
const internalPort = Number(process.env.BATCH_INTERNAL_PORT) || 3310;

logger.info(`Starting batch service with instance ID: ${nodeId}`);

// 共通WebSocketサーバーの設定
const batchServer = new CommonWebSocketServer({
  nodeId: nodeId,
  wsPort: wsPort,
  internalPort: internalPort,
  wsPath: "/ws/batch",
  serviceName: "Batch service",
  healthCheckInterval: 10000,
  instanceTimeout: 30000,
  internalToken: process.env.INTERNAL_TOKEN || "",
});

// サーバーを開始
batchServer.start();
```

## AWS設定

### CloudWatch メトリクス
```javascript
// サービス別のメトリクス送信
const metrics = [
  {
    MetricName: 'AppConnections',
    Value: appClients.length,
    Unit: 'Count',
    Dimensions: [
      { Name: 'InstanceId', Value: instanceId },
      { Name: 'Service', Value: 'app' }
    ]
  },
  {
    MetricName: 'LiveConnections',
    Value: liveClients.length,
    Unit: 'Count',
    Dimensions: [
      { Name: 'InstanceId', Value: instanceId },
      { Name: 'Service', Value: 'live' }
    ]
  },
  {
    MetricName: 'BatchConnections',
    Value: batchClients.length,
    Unit: 'Count',
    Dimensions: [
      { Name: 'InstanceId', Value: instanceId },
      { Name: 'Service', Value: 'batch' }
    ]
  }
];
```

### ALB ターゲットグループ設定
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
      "TargetType": "instance",
      "Tags": [
        {
          "Key": "Service",
          "Value": "app"
        }
      ]
    },
    {
      "Name": "auction-live-tg",
      "Protocol": "HTTP",
      "Port": 3200,
      "VpcId": "vpc-xxxxxxxxx",
      "HealthCheckProtocol": "HTTP",
      "HealthCheckPort": "3200",
      "HealthCheckPath": "/health",
      "TargetType": "instance",
      "Tags": [
        {
          "Key": "Service",
          "Value": "live"
        }
      ]
    },
    {
      "Name": "auction-batch-tg",
      "Protocol": "HTTP",
      "Port": 3300,
      "VpcId": "vpc-xxxxxxxxx",
      "HealthCheckProtocol": "HTTP",
      "HealthCheckPort": "3300",
      "HealthCheckPath": "/health",
      "TargetType": "instance",
      "Tags": [
        {
          "Key": "Service",
          "Value": "batch"
        }
      ]
    }
  ]
}
```

### Auto Scaling Group設定
```json
{
  "AutoScalingGroups": [
    {
      "AutoScalingGroupName": "auction-app-asg",
      "MinSize": 1,
      "MaxSize": 5,
      "DesiredCapacity": 2,
      "Tags": [
        {
          "Key": "Service",
          "Value": "app",
          "PropagateAtLaunch": true
        }
      ]
    },
    {
      "AutoScalingGroupName": "auction-live-asg",
      "MinSize": 1,
      "MaxSize": 3,
      "DesiredCapacity": 1,
      "Tags": [
        {
          "Key": "Service",
          "Value": "live",
          "PropagateAtLaunch": true
        }
      ]
    },
    {
      "AutoScalingGroupName": "auction-batch-asg",
      "MinSize": 1,
      "MaxSize": 2,
      "DesiredCapacity": 1,
      "Tags": [
        {
          "Key": "Service",
          "Value": "batch",
          "PropagateAtLaunch": true
        }
      ]
    }
  ]
}
```

## ログ設定

### CloudWatch Logs
```javascript
// サービス別のロググループ
const logGroups = {
  app: '/aws/auction/app',
  live: '/aws/auction/live',
  batch: '/aws/auction/batch'
};

// ログ送信時の設定
const logConfig = {
  logGroupName: logGroups[serviceType],
  logStreamName: `${nodeId}-${Date.now()}`,
  region: 'ap-northeast-1'
};
```

## 監視設定

### CloudWatch アラーム
```json
{
  "Alarms": [
    {
      "AlarmName": "App-HighCPU",
      "MetricName": "CPUUtilization",
      "Namespace": "AWS/EC2",
      "Dimensions": [
        {
          "Name": "AutoScalingGroupName",
          "Value": "auction-app-asg"
        }
      ],
      "Threshold": 80,
      "ComparisonOperator": "GreaterThanThreshold"
    },
    {
      "AlarmName": "Live-HighCPU",
      "MetricName": "CPUUtilization",
      "Namespace": "AWS/EC2",
      "Dimensions": [
        {
          "Name": "AutoScalingGroupName",
          "Value": "auction-live-asg"
        }
      ],
      "Threshold": 80,
      "ComparisonOperator": "GreaterThanThreshold"
    },
    {
      "AlarmName": "Batch-HighCPU",
      "MetricName": "CPUUtilization",
      "Namespace": "AWS/EC2",
      "Dimensions": [
        {
          "Name": "AutoScalingGroupName",
          "Value": "auction-batch-asg"
        }
      ],
      "Threshold": 80,
      "ComparisonOperator": "GreaterThanThreshold"
    }
  ]
}
```

## デプロイメント設定

### systemd サービスファイル
```ini
# /etc/systemd/system/auction-app.service
[Unit]
Description=Auction App Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/auction-system
Environment=NODE_ENV=production
Environment=NODE_APP_ID=app-instance-001
ExecStart=/usr/bin/node nodeApp.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/auction-live.service
[Unit]
Description=Auction Live Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/auction-system
Environment=NODE_ENV=production
Environment=NODE_LIVE_ID=live-instance-001
ExecStart=/usr/bin/node nodeLive.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/auction-batch.service
[Unit]
Description=Auction Batch Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/auction-system
Environment=NODE_ENV=production
Environment=NODE_BATCH_ID=batch-instance-001
ExecStart=/usr/bin/node nodeBatch.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## トラブルシューティング

### ログ確認コマンド
```bash
# サービス別のログ確認
sudo journalctl -u auction-app.service -f
sudo journalctl -u auction-live.service -f
sudo journalctl -u auction-batch.service -f

# CloudWatch Logs確認
aws logs tail /aws/auction/app --follow
aws logs tail /aws/auction/live --follow
aws logs tail /aws/auction/batch --follow
```

### ヘルスチェック
```bash
# 各サービスのヘルスチェック
curl http://localhost:3100/health
curl http://localhost:3200/health
curl http://localhost:3300/health
```

## 利点まとめ

1. **明確な識別**: ログやメトリクスでサービスが即座に分かる
2. **独立したスケーリング**: サービスごとに最適なリソース配分
3. **運用効率**: 問題の特定と対応が迅速
4. **セキュリティ**: サービスごとのアクセス制御
5. **監視精度**: サービス別の詳細な監視が可能

