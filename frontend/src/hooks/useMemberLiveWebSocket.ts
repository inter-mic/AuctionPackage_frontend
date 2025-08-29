import { useState, useEffect, useRef, useCallback } from "react";
import { TBidHisotry } from "@/types/member/live";
import { NextLotList } from "@/types/common/nextLotList";

interface LiveBidState {
  // 基本状態
  viewOnlyChecked: boolean;
  receivedData: any;
  isBidDisabled: boolean;
  bidStatus: number;
  bidResults: number;
  bidHistory: TBidHisotry[];
  isBidComingSoonMsgFlg: boolean;
  isRakusatsuProcessingMsgFlg: boolean;
  isPriceUpdated: boolean;
  nextLotList: NextLotList[];
  msg: string | null;
  marqueeKey: number;
  showBidEndPopup: boolean;
  bidEndData: any;

  // オークション状態
  fetchLiveAuctionStatus: number;

  // UI状態
  showVideo: boolean;
  showNextLotModal: boolean;
}

interface LiveBidActions {
  // 基本アクション
  setViewOnlyChecked: (checked: boolean) => void;
  setIsBidDisabled: (disabled: boolean) => void;
  setBidStatus: (status: number) => void;
  setBidResults: (results: number) => void;
  setIsPriceUpdated: (updated: boolean) => void;
  setMarqueeKey: (key: number) => void;
  setShowBidEndPopup: (show: boolean) => void;
  setBidEndData: (data: any) => void;

  // オークション状態アクション
  setFetchLiveAuctionStatus: (status: number) => void;

  // UIアクション
  setShowVideo: (show: boolean) => void;
  setShowNextLotModal: (show: boolean) => void;

  // 入札アクション
  bid: () => void;
  closeBidEndPopup: () => void;
  toggleVideo: () => void;
  toggleNextLotModal: () => void;

  // WebSocket関連
  sendWebSocketMessage: (type: string, additionalData?: Record<string, any>) => void;
}

interface Props {
  userId: number;
  fetchAuction: any;
  fetchPaddleNo: string;
  PageProps: any;
}

export const useMemberLiveWebSocket = ({
  userId,
  fetchAuction,
  fetchPaddleNo,
  PageProps,
}: Props): LiveBidState & LiveBidActions => {
  // 基本状態
  const [viewOnlyChecked, setViewOnlyChecked] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<any>(null);
  const [isBidDisabled, setIsBidDisabled] = useState(true);
  const [bidStatus, setBidStatus] = useState(0);
  const [bidResults, setBidResults] = useState(0);
  const [bidHistory, setBidHistory] = useState<TBidHisotry[]>([]);
  const [isBidComingSoonMsgFlg, setBidComingSoonMsgFlg] = useState(false);
  const [isRakusatsuProcessingMsgFlg, setRakusatsuProcessingMsgFlg] = useState(false);
  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const [nextLotList, setNextLotList] = useState<NextLotList[]>([]);
  const [msg, setMsg] = useState<string | null>("");
  const [marqueeKey, setMarqueeKey] = useState(0);
  const [showBidEndPopup, setShowBidEndPopup] = useState(false);
  const [bidEndData, setBidEndData] = useState<any>(null);

  // オークション状態
  const [fetchLiveAuctionStatus, setFetchLiveAuctionStatus] = useState<number>(0);

  // UI状態
  const [showVideo, setShowVideo] = useState(false);
  const [showNextLotModal, setShowNextLotModal] = useState(false);

  // WebSocket接続
  const ws = useRef<WebSocket | null>(null);
  const msgRef = useRef(msg);

  // msgが変わるたびにrefも更新
  useEffect(() => {
    msgRef.current = msg;
  }, [msg]);

  // WebSocket接続関数
  useEffect(() => {
    // 既存の接続があれば閉じる
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_LIVE_URL}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ping処理（サーバーからのpingは無視）
      if (data.type === "ping") {
        return;
      }

      //毎配信処理
      setNextLotList(data.nextLotList);
      setBidHistory(data.liveBidLog);
      setReceivedData(data);
      if (fetchAuction?.spnKbn === "1") {
        setBidStatus(fetchPaddleNo === data.kenriPaddleNo ? 1 : data.isBelowSaiteiPriceFlg ? 5 : 0);
        setIsBidDisabled(data.isBidDisabled || fetchPaddleNo === data.kenriPaddleNo);
      } else {
        setBidStatus(userId === data.kenriUserId ? 1 : data.isBelowSaiteiPriceFlg ? 5 : 0);
        setIsBidDisabled(data.isBidDisabled || userId === data.kenriUserId);
      }

      if (data.msg === "" || msgRef.current !== data.msg) {
        setMsg(data.msg);
        setMarqueeKey((k) => k + 1);
      }

      setBidComingSoonMsgFlg(data.isBidComingSoonMsgFlg);
      setRakusatsuProcessingMsgFlg(data.isRakusatsuProcessingMsgFlg);

      //配信メッセージごと処理
      if (data.type === "set") {
        setShowBidEndPopup(false);
        setBidEndData(null);
      }
      if (data.type === "updatePrice") {
        setIsPriceUpdated(true);
        setTimeout(() => setIsPriceUpdated(false), 1000);
      }
      if (data.type === "bidEnd") {
        setBidResults(
          !data.kenriPaddleNo ? 4 : String(fetchPaddleNo) === String(data.kenriPaddleNo) ? 2 : 3
        );
        setShowBidEndPopup(true);
        setBidEndData(data);
      }
    };

    // クリーンアップ関数
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [fetchPaddleNo, fetchAuction, userId]);

  // 共通データ取得
  const getCommonData = useCallback(
    () => ({
      userId: PageProps.userId,
      paddleNo: fetchPaddleNo,
    }),
    [PageProps.userId, fetchPaddleNo]
  );

  // WebSocketメッセージ送信
  const sendWebSocketMessage = useCallback(
    (type: string, additionalData: Record<string, any> = {}) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const message = {
          type,
          ...getCommonData(),
          ...additionalData,
        };
        ws.current.send(JSON.stringify(message));
      }
    },
    [getCommonData]
  );

  // 入札用関数
  const bid = useCallback(async () => {
    const currentTime = new Date().toISOString();
    sendWebSocketMessage("onlineBid", {
      bidPrice: receivedData?.nextPrice,
      timestamp: currentTime,
    });
    setIsBidDisabled(true);
  }, [sendWebSocketMessage, receivedData?.nextPrice]);

  // UIアクション
  const toggleVideo = useCallback(() => {
    setShowVideo((prev) => !prev);
  }, []);

  const toggleNextLotModal = useCallback(() => {
    setShowNextLotModal((prev) => !prev);
  }, []);

  const closeBidEndPopup = useCallback(() => {
    setShowBidEndPopup(false);
    setBidEndData(null);
  }, []);

  return {
    // 状態
    viewOnlyChecked,
    receivedData,
    isBidDisabled,
    bidStatus,
    bidResults,
    bidHistory,
    isBidComingSoonMsgFlg,
    isRakusatsuProcessingMsgFlg,
    isPriceUpdated,
    nextLotList,
    msg,
    marqueeKey,
    showBidEndPopup,
    bidEndData,
    fetchLiveAuctionStatus,
    showVideo,
    showNextLotModal,

    // アクション
    setViewOnlyChecked,
    setIsBidDisabled,
    setBidStatus,
    setBidResults,
    setIsPriceUpdated,
    setMarqueeKey,
    setShowBidEndPopup,
    setBidEndData,
    setFetchLiveAuctionStatus,
    setShowVideo,
    setShowNextLotModal,
    bid,
    closeBidEndPopup,
    toggleVideo,
    toggleNextLotModal,
    sendWebSocketMessage,
  };
};
