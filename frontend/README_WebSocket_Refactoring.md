# WebSocketサーバー リファクタリング

## 概要

`nodeApp.mjs`と`nodeBatch.mjs`の重複コードを共通化し、保守性と再利用性を向上させました。

## 変更内容

### 1. 共通クラスの作成
- `commonWebSocketServer.mjs` - 共通のWebSocketサーバー機能を提供するクラス

### 2. ファイルの簡素化
- `nodeApp.mjs` - 259行 → 24行（約90%削減）
- `nodeBatch.mjs` - 262行 → 18行（約93%削減）

## 共通化された機能

### WebSocket管理
- 接続管理
- クライアントへのブロードキャスト
- 接続状態の監視

### インスタンス間通信
- インスタンス登録/削除
- インスタンス間ブロードキャスト
- ヘルスチェック
- インスタンス発見

### HTTPエンドポイント
- `/instance/broadcast` - インスタンス間通信
- `/instance/register` - インスタンス登録
- `/instance/unregister` - インスタンス削除
- `/health` - ヘルスチェック
- `/instances` - インスタンス一覧
- `/auctionDataPush` - オークションデータ配信（後方互換性）

### システム管理
- グレースフルシャットダウン
- 定期的なヘルスチェック
- ログ出力

## 使用方法

### 基本的な使用方法

```javascript
import { CommonWebSocketServer } from "./commonWebSocketServer.mjs";

const server = new CommonWebSocketServer({
  nodeId: "my-instance-id",
  port: 3000,
  wsPath: "/ws/app",
  serviceName: "My Service",
  healthCheckInterval: 10000,
  instanceTimeout: 30000,
  internalToken: "your-internal-token",
});

server.start();
```

### カスタムエンドポイントの追加

```javascript
// 設定時に追加
const server = new CommonWebSocketServer({
  // ... 他の設定
  customEndpoints: [
    {
      method: "GET",
      path: "/custom",
      handler: (req, res) => {
        res.json({ message: "Custom endpoint" });
      }
    }
  ]
});

// 動的に追加
server.addCustomEndpoint("POST", "/api/data", (req, res) => {
  res.json({ data: req.body });
});
```

### サーバー情報の取得

```javascript
const info = server.getServerInfo();
console.log(`接続数: ${server.getClientCount()}`);
console.log(`他のインスタンス数: ${server.getOtherInstanceCount()}`);
```

## 環境変数

### 必須
- `NODE_ID` / `INSTANCE_ID` - インスタンスID
- `NODE_APP_PORT` / `NODE_BATCH_PORT` - ポート番号

### オプション
- `OTHER_INSTANCES` - 他のインスタンスのリスト（カンマ区切り）
- `INTERNAL_TOKEN` - インスタンス間通信用のトークン

## 利点

1. **保守性の向上** - 共通機能の変更は1箇所で済む
2. **コードの重複削減** - 約90%のコード削減
3. **一貫性の確保** - 両サービスで同じ動作を保証
4. **拡張性** - カスタムエンドポイントの追加が容易
5. **テスト容易性** - 共通クラスの単体テストが可能

## 後方互換性

既存のエンドポイント（`/auctionDataPush`など）は引き続き利用可能です。

## 今後の拡張

- メトリクス収集機能
- より詳細なヘルスチェック
- 負荷分散機能
- セキュリティ強化
