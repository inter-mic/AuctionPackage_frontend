import { useEffect, useRef, useState } from "react";
import { TAuctionWebSocketData } from "@/types/member/AuctionWebSocket";

export const useAuctionWebSocket = (
  onUpdateApp: (data: TAuctionWebSocketData) => void,
  onUpdateBatch: (data: TAuctionWebSocketData) => void,
  isLoaded: boolean
) => {
  const appSocketRef = useRef<WebSocket | null>(null);
  const batchSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const connectWebSocket = (url: string, onMessage: (event: MessageEvent) => void): WebSocket => {
      const socket = new WebSocket(url);

      socket.onmessage = onMessage;
      socket.onclose = () => {
        setTimeout(() => {
          const newSocket = connectWebSocket(url, onMessage);
          if (url === process.env.NEXT_PUBLIC_WS_APP_URL) {
            appSocketRef.current = newSocket;
          }
          if (url === process.env.NEXT_PUBLIC_WS_BATCH_URL) {
            batchSocketRef.current = newSocket;
          }
        }, 3000);
      };

      return socket;
    };
    if (isLoaded) {
      appSocketRef.current = connectWebSocket(`${process.env.NEXT_PUBLIC_WS_APP_URL}`, (event) => {
        const auctionWebSocketDataList: TAuctionWebSocketData[] = JSON.parse(event.data);
        auctionWebSocketDataList.forEach(onUpdateApp);
      });

      batchSocketRef.current = connectWebSocket(
        process.env.NEXT_PUBLIC_WS_BATCH_URL || "", // ← fallback対策
        (event) => {
          const auctionWebSocketDataList: TAuctionWebSocketData[] = JSON.parse(event.data);
          auctionWebSocketDataList.forEach(onUpdateBatch);
        }
      );
    }

    return () => {
      if (appSocketRef.current) appSocketRef.current.close();
      if (batchSocketRef.current) batchSocketRef.current.close();
    };
  }, [onUpdateApp, onUpdateBatch, isLoaded]);
};
