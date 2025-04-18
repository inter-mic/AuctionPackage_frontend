const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

let latestData = {}; // 最新のデータを保持
let connectionCount = 0; // 接続数をトラッキング

wss.on('connection', (ws) => {
  
  connectionCount++;
  updateAdminConnectionCount(); 
  if (latestData.type) {
    ws.send(JSON.stringify(latestData));
  }
  ws.isAdmin = false; 
  ws.on('message', (message) => {

    const data = JSON.parse(message);

    // 管理者の認証
    if (data.type === 'admin') {
      ws.isAdmin = true;
      connectionCount--; // 管理者になったので非管理者から除外
      updateAdminConnectionCount();
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
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (data.type === 'onlineBid') {
          if (client !== ws && client.isAdmin) {
            client.send(JSON.stringify({ type: data.type, userId: data.userId, bidPrice: data.bidPrice }));
          }
        } else {
          let payload = { type: data.type, ...commonData, ...latestData };

          if (data.type === 'start') {
            payload = {
              ...payload,
              currentPrice: data.currentPrice,
              nextPrice: data.nextPrice,
            };
          }
          if (data.type === 'updatePrice') {
            payload = {
              ...payload,
              kenriUserId: data.kenriUserId,
              currentPrice: data.currentPrice,
              nextPrice: data.nextPrice,
              belowSaiteiPriceUserIdList: data.belowSaiteiPriceUserIdList,
            };
          }
          if (data.type === 'bidEnd') {
            payload = {
              ...payload,
              kenriUserId: data.kenriUserId,
            };
          }
          client.send(JSON.stringify(payload));
        }
      }
    });
  });

  ws.isAdmin = false;
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'admin') {
      ws.isAdmin = true;
    }
  });

  ws.on('close', () => {
    if (!ws.isAdmin) {
      connectionCount--; // 非管理者の切断を反映
      updateAdminConnectionCount();
    }
    updateAdminConnectionCount(); 
  });
});

function updateAdminConnectionCount() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.isAdmin) {
      client.send(JSON.stringify({ type: 'connectionCount', count: connectionCount }));
    }
  });
}


