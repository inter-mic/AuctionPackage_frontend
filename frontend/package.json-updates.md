# Package.json 更新ガイド

## 概要
AWS ALB + EC2 スティッキーセッション構成に対応するため、必要な依存関係を追加します。

## 追加が必要な依存関係

### 1. 既存のpackage.jsonに追加

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "aws-sdk": "^2.1500.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

### 2. インストールコマンド

```bash
# 本番依存関係
npm install axios aws-sdk

# 開発依存関係
npm install --save-dev @types/node
```

## 環境変数設定

### 1. .env ファイル

```bash
# インスタンス設定
INSTANCE_ID=i-xxxxxxxxx
INSTANCE_COMMUNICATION_PORT=3101
OTHER_INSTANCES=10.0.1.10,10.0.1.11,10.0.1.12

# AWS設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# アプリケーション設定
NODE_ENV=production
```

### 2. EC2 インスタンスプロファイル設定

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:PutParameter",
        "cloudwatch:PutMetricData",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

## 起動スクリプト

### 1. systemd サービスファイル

```ini
# /etc/systemd/system/auction-websocket.service
[Unit]
Description=Auction WebSocket Server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/auction-system
Environment=NODE_ENV=production
Environment=INSTANCE_ID=i-xxxxxxxxx
Environment=INSTANCE_COMMUNICATION_PORT=3101
ExecStart=/usr/bin/node nodeAuction.mjs
ExecStart=/usr/bin/node nodeLive.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 2. サービス管理コマンド

```bash
# サービスを有効化
sudo systemctl enable auction-websocket

# サービスを開始
sudo systemctl start auction-websocket

# サービス状態確認
sudo systemctl status auction-websocket

# ログ確認
sudo journalctl -u auction-websocket -f
```

## ヘルスチェック設定

### 1. ヘルスチェックエンドポイント

```javascript
// health-check.js
const http = require('http');
const axios = require('axios');

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    try {
      // WebSocketサービスのヘルスチェック
      const auctionHealth = await axios.get('http://localhost:3101/health');
      const liveHealth = await axios.get('http://localhost:3002/health');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        auction: auctionHealth.data,
        live: liveHealth.data,
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

### 2. ヘルスチェックサービスの起動

```bash
# ヘルスチェックサーバーを起動
nohup node health-check.js > health-check.log 2>&1 &
```

## ログローテーション設定

### 1. logrotate 設定

```bash
# /etc/logrotate.d/auction-websocket
/home/ec2-user/auction-system/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
    postrotate
        systemctl reload auction-websocket
    endscript
}
```

### 2. ログディレクトリ作成

```bash
# ログディレクトリを作成
mkdir -p /var/log/auction-websocket
chown ec2-user:ec2-user /var/log/auction-websocket
```

## 監視設定

### 1. CloudWatch アラーム設定

```bash
# 接続数アラーム
aws cloudwatch put-metric-alarm \
  --alarm-name "auction-websocket-connections" \
  --alarm-description "WebSocket connection count alarm" \
  --metric-name "ActiveConnections" \
  --namespace "Auction/WebSocket" \
  --statistic "Average" \
  --period 300 \
  --threshold 100 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2

# CPU使用率アラーム
aws cloudwatch put-metric-alarm \
  --alarm-name "auction-websocket-cpu" \
  --alarm-description "CPU utilization alarm" \
  --metric-name "CPUUtilization" \
  --namespace "AWS/EC2" \
  --statistic "Average" \
  --period 300 \
  --threshold 80 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2
```

### 2. SNS通知設定

```bash
# SNSトピック作成
aws sns create-topic --name auction-websocket-alerts

# アラームにSNS通知を追加
aws cloudwatch put-metric-alarm \
  --alarm-name "auction-websocket-connections" \
  --alarm-actions "arn:aws:sns:region:account:auction-websocket-alerts"
```

## セキュリティ設定

### 1. セキュリティグループ設定

```bash
# インスタンス間通信用ポートを開く
aws ec2 authorize-security-group-ingress \
  --group-name auction-websocket-sg \
  --protocol tcp \
  --port 3101 \
  --source-group auction-websocket-sg

# ヘルスチェック用ポートを開く
aws ec2 authorize-security-group-ingress \
  --group-name auction-websocket-sg \
  --protocol tcp \
  --port 8080 \
  --source-group auction-websocket-sg
```

### 2. IAMロール設定

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeTags",
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeAutoScalingInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

## デプロイメントスクリプト

### 1. デプロイスクリプト

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# 依存関係のインストール
npm install

# 環境変数の設定
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
INSTANCE_COMMUNICATION_PORT=3101
NODE_ENV=production
EOF
fi

# サービスの再起動
sudo systemctl restart auction-websocket

# ヘルスチェック
sleep 10
curl -f http://localhost:8080/health || exit 1

echo "Deployment completed successfully!"
```

### 2. ロールバックスクリプト

```bash
#!/bin/bash
# rollback.sh

echo "Starting rollback..."

# 前のバージョンに戻す
git reset --hard HEAD~1

# 依存関係の再インストール
npm install

# サービスの再起動
sudo systemctl restart auction-websocket

echo "Rollback completed!"
```

## トラブルシューティング

### 1. よくある問題と解決方法

#### ポートが既に使用されている
```bash
# 使用中のポートを確認
sudo netstat -tlnp | grep :3101

# プロセスを終了
sudo kill -9 <PID>
```

#### メモリ不足
```bash
# メモリ使用量を確認
free -h

# Node.jsのメモリ制限を設定
export NODE_OPTIONS="--max-old-space-size=2048"
```

#### 接続タイムアウト
```bash
# ネットワーク接続を確認
ping 10.0.1.10

# ファイアウォール設定を確認
sudo iptables -L
```

### 2. ログ分析

```bash
# エラーログを確認
grep -i error /home/ec2-user/auction-system/*.log

# 接続ログを確認
grep -i "connection" /home/ec2-user/auction-system/*.log

# パフォーマンスログを確認
grep -i "performance" /home/ec2-user/auction-system/*.log
``` 