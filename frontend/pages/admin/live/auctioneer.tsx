import React from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { texts } from "@/config/texts.ja";
import { useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminNoHeaderLayout from "@/hocs/withAdminNoHeaderLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";
import { useExecutionPermission } from "@/hooks/useExecutionPermission";
import { getBidUnit } from "@/components/admin/live/getBidUnit";
//API
import { useGoodsSearchByGoodsIdAPI } from "@/hooks/api/admin/goods/useGoodsSearchByGoodsIdAPI";
import { useLiveBidInfoGetNextLotListAPI } from "@/hooks/api/admin/live/bidInfo/useLiveBidInfoGetNextLotListAPI";
import { useLiveBidInfoSearchAPI } from "@/hooks/api/admin/live/bidInfo/useLiveBidInfoSearchAPI";
import { useLiveBidUnitSearchAPI } from "@/hooks/api/admin/live/bidunit/useLiveBidUnitSearchAPI";
import { useGoodsSearchBeforeAfterLotAPI } from "@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI";
import { useLiveBidKekkaUpdateAPI } from "@/hooks/api/admin/live/useLiveBidKekkaUpdateAPI";
import { useAdminSessionAPI } from "@/hooks/api/admin/useAdminSessionAPI";
//型定義
import { GoodsData, initialGoodsData } from "@/types/admin/goods/register";
import { LiveBidKekkaData, initialLiveBidKekkaData } from "@/types/admin/live/register";
import { TBidHisotry, TLiveBidLog } from "@/types/admin/live/auctioneer";
import { NextLotList } from "@/types/common/nextLotList";
import { PageProps } from "@/types/admin/adminPage";
import { Errors } from "@/types/errors";
import { TMtLiveBidUnit } from "@/types/common/bidUnit";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/KaisaiListPullDown";
import { LiveMessageListPullDown } from "@/components/ui/pulldowns/LiveMessageListPullDown";
import NextLotListComponent from "@/components/common/live/NextLotListComponent";
import {
  formatPriceDivision,
  formatPriceWithCommas,
  formatPriceMultiplication,
  formatPriceNum,
} from "@/components/common/PriceUtils";
import ConfirmDialog from "@/components/ui/dialog/auctioneerConfirmDialog";
import AuctioneerConfirmDialog from "@/components/ui/dialog/auctioneerConfirmDialog";
//ボタン
import { CallButton } from "@/components/ui/buttons/admin/live/callButton";
import { LotBeforeAffterButton } from "@/components/ui/buttons/admin/live/LotBeforeAffterButton";
import { SetButton } from "@/components/ui/buttons/admin/live/setButton";
import { StartButton } from "@/components/ui/buttons/admin/live/startButton";
import { SerihabaButton } from "@/components/ui/buttons/admin/live/serihabaButton";
import { OnlinePriceButton } from "@/components/ui/buttons/admin/live/onlinePriceButton";
import { CurrentPriceButton } from "@/components/ui/buttons/admin/live/currentPriceButton";
import { StatusButton } from "@/components/ui/buttons/admin/live/statusButton";
import { MessageButton } from "@/components/ui/buttons/admin/live/messageButton";

//スタイル
import styles from "@/styles/admin/Auctioneer.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {
      pageTitle: texts.menu.adminAuctionner,
    },
  };
});

export interface StartButtonHandle {
  trigger: () => void;
}
export interface SerihabaButtonHandle {
  trigger: () => void;
}
export interface PriceButtonHandle {
  trigger: () => void;
}
export interface OnlinePriceButtonHandle {
  trigger: () => void;
}

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect, texts } = useCommonSetup();
  useKengenRedirect(kengen, 601);
  const { executionPermission } = useExecutionPermission(kengen);
  const { spnKbn } = useRouter().query;

  //タイムアウト防止のためセッション延長
  const { adminSessionAPI } = useAdminSessionAPI();
  useEffect(() => {
    const intervalId = setInterval(() => {
      adminSessionAPI();
      //30分ごと
    }, 1800000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [goodsData, setGoodsData] = useState<GoodsData>(initialGoodsData);

  const [searchSelectedKaisai, setSearchSelectedKaisai] = useState<string>("");
  const [searchLot, setSearchLot] = useState<string>("");
  const handleSearchKaisaiChange = (name: string, value: string) => {
    setSearchSelectedKaisai(value);
  };
  const handleSearchLotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLot(e.target.value);
  };

  const { liveBidUnitList } = useLiveBidUnitSearchAPI();
  const [fetchBidUnitList, setFetchBidUnitList] = useState<TMtLiveBidUnit[]>([]);
  useEffect(() => {
    if (liveBidUnitList) {
      setFetchBidUnitList(liveBidUnitList);
    }
  }, [liveBidUnitList]);

  const [isCallDisabled, setIsCallDisabled] = useState(false);
  const [isCallButtonClicked, setIsCallButtonClicked] = useState(false);
  const [isSetButtonClicked, setIsSetButtonClicked] = useState(false);
  const [isStartButtonClicked, setIsStartButtonClicked] = useState(false);

  //検索(呼び出し)
  const { fetchGoodsData, goodsSearchErrors, goodsSearchByGoodsIdAPI } =
    useGoodsSearchByGoodsIdAPI();
  const {
    fetchLiveBidNextLotListData,

    liveBidInfoGetNextLotListAPI,
  } = useLiveBidInfoGetNextLotListAPI();
  const { fetchLiveBidInfoData, liveBidInfoSearchAPI } = useLiveBidInfoSearchAPI();
  const [inputSeatchErrors, setInputSeatchErrors] = useState<Errors>();

  const [isRakusatsuProcessingMsgFlg, setRakusatsuProcessingMsgFlg] = useState(false);
  const [isRakusatsuPaddleNoError, setIsRakusatsuPaddleNoError] = useState<boolean>(false);

  const lotSearch = useCallback(async () => {
    setOnlineBidHistory([]);
    setLiveBidLog([]);
    setAuctioneerFlg(false);
    goodsSearchByGoodsIdAPI(false, 0, searchSelectedKaisai, searchLot);
  }, [goodsSearchByGoodsIdAPI, searchSelectedKaisai, searchLot]);

  //商品データセット
  useEffect(() => {
    if (fetchGoodsData.goodsId != null) {
      setGoodsData(fetchGoodsData);
      setSearchLot(fetchGoodsData.lot || "");
      setIsCallButtonClicked(true);
      setLiveBidkekkaData((prevLiveBidkekkaData) => ({
        ...prevLiveBidkekkaData,
        goodsId: fetchGoodsData.goodsId,
      }));

      liveBidInfoGetNextLotListAPI(false, 0, searchSelectedKaisai);
      liveBidInfoSearchAPI(false, 0, searchSelectedKaisai, searchLot, searchLot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);
  useEffect(() => {
    if (goodsSearchErrors) {
      setInputSeatchErrors(goodsSearchErrors);
    }
  }, [goodsSearchErrors]);

  // 次商品リストセット
  const [nextLotList, setNextLotList] = useState<NextLotList[]>([]);
  useEffect(() => {
    if (fetchLiveBidNextLotListData.length > 0) {
      const nextLots: NextLotList[] = fetchLiveBidNextLotListData.map(
        ({ goodsName, lot, startPrice, rakusatsuUserId, thumbnailImageUrl }) => ({
          goodsName,
          lot,
          startPrice,
          rakusatsuUserId,
          thumbnailImageUrl,
        })
      );
      setNextLotList(nextLots);
    }
  }, [fetchLiveBidNextLotListData]);

  //呼び出しから各価格セット
  const [saiteiRakusatsuPrice, setSaiteiRakusatsuPricePrice] = useState<string>("");
  const [firstPreBidUserId, setFirstPreBidUserId] = useState<number | null>();
  const [firstPreBidPrice, setFirstPreBidPrice] = useState<string>("");
  const [secondPreBidUserId, setSecondPreBidUserId] = useState<number | null>();
  const [secondPreBidPrice, setSecondPreBidPrice] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [displayCurrentPrice, setDisplayCurrentPrice] = useState<string>("");
  const [nextPrice, setNextPrice] = useState<string>("");
  const [bidUnit, setBidUnit] = useState<string>("");
  const [kenriUserId, setKenriUserId] = useState<number | null>();
  const [kenriPaddleNo, setKenriPaddleNo] = useState<string | null>();
  const [kenriUpdatePrice, setKenriUpdatePrice] = useState<string>("");
  const [isBelowSaiteiPriceFlg, setIsBelowSaiteiPriceFlg] = useState<boolean>(false);

  useEffect(() => {
    if (fetchLiveBidInfoData) {
      //最低落札価格セット
      if (fetchLiveBidInfoData.saiteiRakusatsuPrice) {
        const formattedSaiteiRakusatsuPrice = formatPriceWithCommas(
          Number(fetchLiveBidInfoData.saiteiRakusatsuPrice.replace(/,/g, ""))
        );
        setSaiteiRakusatsuPricePrice(formattedSaiteiRakusatsuPrice);
      } else {
        setSaiteiRakusatsuPricePrice("");
      }

      //最高事前入札者・価格セット
      if (fetchLiveBidInfoData.firstPreBidPrice) {
        const formattedFirstPreBidPrice = formatPriceWithCommas(
          Number(fetchLiveBidInfoData.firstPreBidPrice.replace(/,/g, ""))
        );
        setFirstPreBidPrice(formattedFirstPreBidPrice);
        setFirstPreBidUserId(fetchLiveBidInfoData.firstPreBidUserId);
      } else {
        setFirstPreBidPrice("");
        setFirstPreBidUserId(null);
      }

      //2番目事前入札者・価格セット
      if (fetchLiveBidInfoData.secondPreBidPrice) {
        const formattedSecondPreBidPrice = formatPriceWithCommas(
          Number(fetchLiveBidInfoData.secondPreBidPrice.replace(/,/g, ""))
        );
        setSecondPreBidPrice(formattedSecondPreBidPrice);
        setSecondPreBidUserId(fetchLiveBidInfoData.secondPreBidUserId);
      } else {
        setSecondPreBidPrice("");
        setSecondPreBidUserId(null);
      }

      //現在価格セット
      if (fetchLiveBidInfoData.currentPrice) {
        const formattedCurrentPrice = formatPriceWithCommas(
          Number(fetchLiveBidInfoData.currentPrice.replace(/,/g, "")) / 1000
        );
        setCurrentPrice(formattedCurrentPrice);
        setDisplayCurrentPrice(
          formatPriceWithCommas(Number(fetchLiveBidInfoData.currentPrice.replace(/,/g, "")))
        );
      } else {
        setCurrentPrice("");
      }

      //次価格セット
      const fetchBitUnit = getBidUnit(
        spnKbn,
        fetchLiveBidInfoData.bidUnit,
        fetchBidUnitList,
        fetchLiveBidInfoData.currentPrice
      );
      if (spnKbn === "1") {
        if (fetchLiveBidInfoData.currentPrice) {
          const nextPrice = formatPriceWithCommas(
            (Number(fetchLiveBidInfoData.currentPrice.replace(/,/g, "")) + Number(fetchBitUnit)) /
              1000
          );
          setNextPrice(nextPrice);
        }
      } else {
        if (fetchLiveBidInfoData.nextPrice) {
          const formattedNextPrice = formatPriceWithCommas(
            Number(fetchLiveBidInfoData.nextPrice.replace(/,/g, "")) / 1000
          );
          setNextPrice(formattedNextPrice);
        } else {
          setNextPrice("");
        }
      }

      //権利者セット
      if (fetchLiveBidInfoData.kenriUserId) {
        setKenriUserId(fetchLiveBidInfoData.kenriUserId);
        setLiveBidkekkaData((prevLiveBidkekkaData) => ({
          ...prevLiveBidkekkaData,
          rakusatsuUserId: fetchLiveBidInfoData.kenriUserId,
          rakusatsuPrice: fetchLiveBidInfoData.firstPreBidPrice?.replace(/,/g, ""),
          auctionKekkaStatus: 2,
        }));
      } else {
        setKenriUserId(null);
      }

      //セリ幅セット

      if (fetchBitUnit) {
        setBidUnit(formatPriceWithCommas(Number(fetchBitUnit)));
      }

      //権利者更新処理用
      const saiteiPriceNumber = fetchLiveBidInfoData.saiteiRakusatsuPrice
        ? Number(fetchLiveBidInfoData.saiteiRakusatsuPrice.replace(/,/g, ""))
        : 0;
      const firstPreBidPriceNumber = fetchLiveBidInfoData.firstPreBidPrice
        ? Number(fetchLiveBidInfoData.firstPreBidPrice.replace(/,/g, ""))
        : 0;
      setKenriUpdatePrice(
        (saiteiPriceNumber > firstPreBidPriceNumber
          ? saiteiPriceNumber
          : firstPreBidPriceNumber
        ).toString()
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLiveBidInfoData]);

  //LOT前後
  const { beforeAfterGoodsId, goodsSearchBeforeAfterLotAPI } = useGoodsSearchBeforeAfterLotAPI();
  useEffect(() => {
    const auctionSeq = fetchGoodsData?.auctionSeq ?? 0;
    const lot = fetchGoodsData?.lot ?? "";
    if (auctionSeq != 0 && lot != "") {
      goodsSearchBeforeAfterLotAPI(auctionSeq, lot, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData?.auctionSeq, fetchGoodsData?.lot]);
  const lotBeforeAffterSearch = useCallback(
    async (isBefore: boolean) => {
      const goodsId = isBefore
        ? beforeAfterGoodsId?.beforeGoodsId
        : beforeAfterGoodsId?.afterGoodsId;
      await goodsSearchByGoodsIdAPI(true, Number(goodsId), "", "");
      await liveBidInfoSearchAPI(true, Number(goodsId), searchSelectedKaisai, "", "");
      await liveBidInfoGetNextLotListAPI(true, Number(goodsId), searchSelectedKaisai);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      beforeAfterGoodsId,
      goodsSearchByGoodsIdAPI,
      liveBidInfoSearchAPI,
      liveBidInfoGetNextLotListAPI,
      searchSelectedKaisai,
      searchLot,
    ]
  );
  const [liveBidkekkaData, setLiveBidkekkaData] =
    useState<LiveBidKekkaData>(initialLiveBidKekkaData);
  const [onlineBidHistory, setOnlineBidHistory] = useState<TBidHisotry[]>([]);
  const [liveBidLog, setLiveBidLog] = useState<TLiveBidLog[]>([]);
  const [connectionCount, setConnectionCount] = useState<number | null>();
  const [isAuctioneerFlg, setAuctioneerFlg] = useState(false);
  const [isBidComingSoonMsgFlg, setBidComingSoonMsgFlg] = useState(false);
  const [msg, setMsg] = useState<string | null>();
  const [marqueeKey, setMarqueeKey] = useState(0);
  const lotInputRef = useRef<HTMLInputElement>(null);
  const currentPriceInputRef = useRef<HTMLInputElement>(null);
  const rakusatsuPaddleNoInputRef = useRef<HTMLInputElement>(null);

  const ws = useRef<WebSocket | null>(null);

  // オンライン入札履歴の最上位行のlatestBid状態を管理
  const [isLatestBidActive, setIsLatestBidActive] = useState(false);

  // WebSocket接続関数
  useEffect(() => {
    // WebSocketの初期化

    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_LIVE_URL}`);

    ws.current.onopen = () => {
      const message = {
        type: "admin",
        ...getCommonData(),
        nextLotList,
        liveBidLog,
        msg,
      };
      ws.current?.send(JSON.stringify(message));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ping処理（サーバーからのpingは無視）
      if (data.type === "ping") {
        return;
      }

      if (data.type === "connectionCount") {
        setConnectionCount(data.count);
        return;
      }

      setBidComingSoonMsgFlg(data.isBidComingSoonMsgFlg);
      setRakusatsuProcessingMsgFlg(data.isRakusatsuProcessingMsgFlg);

      if (data.type === "set") {
        setIsCallDisabled(true);
        setIsCallButtonClicked(false);
        setIsSetButtonClicked(true);
        setBidUnit(data.bidUnit ? formatPriceWithCommas(Number(data.bidUnit)) : "");
        setCurrentPrice(data.currentPrice ? formatPriceDivision(data.currentPrice) : "");
        currentPriceInputRef.current?.focus();
      }
      if (data.type === "start") {
        setIsStartButtonClicked(true);
        setIsSetButtonClicked(false);
      }
      if (data.type === "onlineBid") {
        setOnlineBidHistory((prevHistory) => [
          { userId: data.userId, paddleNo: data.paddleNo, bidPrice: data.bidPrice },
          ...prevHistory, // 最新のデータを上部に追加
        ]);

        setIsLatestBidActive(true);
      }
      if (data.type === "rakusatsuProcessing") {
        if (kenriPaddleNo != null) {
          setLiveBidkekkaData((prev) => ({
            ...prev,
            rakusatsuPaddleNo: kenriPaddleNo,
          }));
        }
      } else {
        setLiveBidkekkaData((prev) => ({
          ...prev,
          rakusatsuPaddleNo: "",
        }));
      }
      if (data.type === "bidEnd") {
        setOnlineBidHistory([]);
        setLiveBidLog([]);
        setIsStartButtonClicked(false);
        setAuctioneerFlg(false);
        setIsLatestBidActive(false);
      }
      if (data.type === "clear") {
        auctioneerClear();
        setIsLatestBidActive(false);
        lotInputRef.current?.focus();
      }
      if (data.type === "sendMessage") {
        setMsg(data.msg);
        setMarqueeKey((k) => k + 1);
      }
    };
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCommonData = useCallback(
    () => ({
      goodsId: fetchGoodsData.goodsId,
      lot: fetchGoodsData.lot,
      goodsName: fetchGoodsData.goodsName,
      goodsImage: fetchGoodsData.thumbnailImageUrl,
    }),
    [fetchGoodsData]
  );

  const getClearCommonData = useCallback(
    () => ({
      goodsId: "",
      lot: "",
      goodsName: "",
      goodsImage: "",
    }),
    []
  );

  const sendWebSocketMessage = useCallback(
    (type: string, additionalData: Record<string, any> = {}) => {
      if (!isAuctioneerFlg) {
        if (type === "sendMessage") {
          // メッセージ配信は可能
        } else {
          return; //「セット」を押した者以外配信不可
        }
      }
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        let message;
        if (type === "clear") {
          message = {
            type,
            ...getClearCommonData(),
            ...additionalData,
          };
        } else if (type === "sendMessage") {
          message = {
            type,
            ...getCommonData(),
            ...additionalData,
            nextLotList,
            liveBidLog,
          };
        } else {
          message = {
            type,
            ...getCommonData(),
            ...additionalData,
            nextLotList,
            liveBidLog,
            // msg,
          };
        }
        ws.current.send(JSON.stringify(message));
      }
    },
    [isAuctioneerFlg, ws, getClearCommonData, getCommonData, nextLotList, liveBidLog]
  );

  // 強制クリア用関数
  const clear = async () => {
    sendWebSocketMessage("clear", {
      nextPrice: "",
      currentPrice: "",
      kenriPaddleNo: "",
      isBelowSaiteiPriceFlg: "",
      nextLotList: [],
      liveBidLog: [],
      msg: "",
    });
  };

  const { liveBidKekkaUpdateAPI } = useLiveBidKekkaUpdateAPI();

  const bidLiveAuctionEnd = useCallback(async () => {
    sendWebSocketMessage("bidEnd", { kenriUserId: kenriUserId });
    const result = await liveBidKekkaUpdateAPI(
      liveBidkekkaData.auctionKekkaStatus,
      liveBidkekkaData,
      liveBidLog,
      connectionCount
    );
    if (result.success) {
      const nextLot = (Number(searchLot) + 1).toString();
      goodsSearchByGoodsIdAPI(false, 0, searchSelectedKaisai, nextLot);
      setLiveBidkekkaData(initialLiveBidKekkaData);
    } else {
      if (result.errorMessage) {
        toast.error(result.errorMessage);
        setRakusatsuProcessingMsgFlg(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sendWebSocketMessage,
    kenriUserId,
    liveBidKekkaUpdateAPI,
    liveBidkekkaData,
    liveBidLog,
    connectionCount,
    spnKbn,
    searchLot,
    goodsSearchByGoodsIdAPI,
    searchSelectedKaisai,
    setLiveBidkekkaData,
    setRakusatsuProcessingMsgFlg,
  ]);

  //落札処理用
  const bidLiveBidEnd = useCallback(
    async (isRakusatsu: boolean) => {
      if (isRakusatsu) {
        if (
          liveBidkekkaData.rakusatsuPaddleNo === null ||
          liveBidkekkaData.rakusatsuPaddleNo === ""
        ) {
          toast.error("落札パドル番号を入力してください");
          setIsRakusatsuPaddleNoError(true);
          return;
        }
      }

      const result = await liveBidKekkaUpdateAPI(
        isRakusatsu ? 2 : 1,
        liveBidkekkaData,
        liveBidLog,
        connectionCount
      );
      if (result.success) {
        lotBeforeAffterSearch(false);
        setLiveBidkekkaData(initialLiveBidKekkaData);
        if (isRakusatsu) {
          sendWebSocketMessage("bidEnd", {
            kenriPaddleNo: liveBidkekkaData.rakusatsuPaddleNo,
            isRakusatsuProcessingMsgFlg: false,
            isBidDisabled: true,
          });
        } else {
          sendWebSocketMessage("bidEnd", {
            kenriPaddleNo: null,
            isRakusatsuProcessingMsgFlg: false,
            isBidDisabled: true,
          });
        }
        lotSearch;
      } else {
        if (result.errorMessage) {
          toast.error(result.errorMessage);
          setIsRakusatsuPaddleNoError(true);
          setRakusatsuProcessingMsgFlg(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      liveBidkekkaData,
      setIsRakusatsuPaddleNoError,
      sendWebSocketMessage,
      liveBidKekkaUpdateAPI,
      liveBidLog,
      connectionCount,
      spnKbn,
      lotBeforeAffterSearch,
      lotSearch,
      setLiveBidkekkaData,
      setRakusatsuProcessingMsgFlg,
    ]
  );

  //オンライン入札時の処理価格
  useEffect(() => {
    if (onlineBidHistory.length > 0) {
      if (spnKbn == "1") {
        //オンライン＋会場入札：会員画面の入札ボタンを非表示にする
        sendWebSocketMessage("isBidDisabled", {
          currentPrice: formatPriceMultiplication(currentPrice),
          bidUnit: formatPriceNum(bidUnit),
          nextPrice: formatPriceMultiplication(nextPrice),
          kenriUserId: kenriUserId,
          isBelowSaiteiPriceFlg: isBelowSaiteiPriceFlg,
          isBidDisabled: true,
        });
      }
      if (spnKbn == "2") {
        //オンラインのみ：入札後自動で配信
        onlinePriceButtonRef.current?.trigger();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineBidHistory]);

  // メッセージを配信用関数
  const [message, setMessage] = useState<string>();
  const handleSetMessageChange = (value: string) => {
    setMessage(value);
  };
  const sendMessage = async () => {
    sendWebSocketMessage("sendMessage", {
      msg: message,
    });
  };

  //落札者パドル番号
  const handleRakusatsuPaddleNoChange = (value: string) => {
    setLiveBidkekkaData((prev) => ({
      ...prev,
      rakusatsuPaddleNo: value,
    }));
  };

  // クリア処理
  const auctioneerClear = async () => {
    setSaiteiRakusatsuPricePrice("");
    setFirstPreBidUserId(null);
    setFirstPreBidPrice("");
    setSecondPreBidUserId(null);
    setSecondPreBidPrice("");
    setCurrentPrice("");
    setNextPrice("");
    setBidUnit("");
    setKenriUserId(null);
    setKenriPaddleNo(null);
    setOnlineBidHistory([]);
    setLiveBidLog([]);
    setLiveBidkekkaData(initialLiveBidKekkaData);
    setNextLotList([]);
    setDisplayCurrentPrice(displayCurrentPrice);
    setGoodsData(initialGoodsData);
    setSearchLot("");
    setMsg("");
    setIsCallDisabled(false);
    setIsCallButtonClicked(false);
    setIsStartButtonClicked(false);
    setIsSetButtonClicked(false);
    setAuctioneerFlg(false);
    setIsLatestBidActive(false);
  };

  const set = useCallback(async () => {
    setAuctioneerFlg(true);
  }, [setAuctioneerFlg]);

  //現在価格配信時チェック用
  const [isNextPriceBelow, setIsNextPriceBelow] = useState<boolean>(false);
  useEffect(() => {
    setIsNextPriceBelow(false);
  }, [nextPrice]);
  useEffect(() => {
    setIsNextPriceBelow(false);
  }, [currentPrice]);

  //現在価格を手入力で変更後、セリ幅に応じて次価格も変更する
  const manualSetNextPrice = async (value: string) => {
    const current = formatPriceMultiplication(value);
    const fetchBitUnit = getBidUnit(
      spnKbn,
      fetchGoodsData?.bidUnit,
      fetchBidUnitList,
      current.toString()
    );
    if (fetchBitUnit) {
      const bidUnit = Number(fetchBitUnit);
      const manualNextPrice = current + bidUnit;
      setNextPrice(formatPriceDivision(manualNextPrice.toString()));
    }
  };

  const startButtonRef = useRef<StartButtonHandle>(null);
  const plusRef = useRef<SerihabaButtonHandle>(null);
  const minusRef = useRef<SerihabaButtonHandle>(null);
  const priceButtonRef = useRef<PriceButtonHandle>(null);
  const onlinePriceButtonRef = useRef<OnlinePriceButtonHandle>(null);
  const [rakusatsuConfirmOpen, setRakusatsuConfirmOpen] = useState(false);
  const [furakusatsuConfirmOpen, setFuRakusatsuConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  //ショートカットキー
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "F1") {
        event.preventDefault(); // F1のときだけ最初に必ず呼ぶ
        if (!isRakusatsuProcessingMsgFlg) return;
        if (furakusatsuConfirmOpen) {
          if (spnKbn == "1") {
            bidLiveBidEnd(false);
          } else {
            bidLiveAuctionEnd();
          }
          setFuRakusatsuConfirmOpen(false); // モーダルを閉じる
        } else {
          setFuRakusatsuConfirmOpen(true);
        }
      }
      if (event.key === "F2") {
        if (!isCallDisabled) return;
        event.preventDefault();
        lotSearch();
        return;
      }
      if (event.key === "F3" && isCallButtonClicked) {
        event.preventDefault();
        set();
        return;
      }
      if (event.key === "F4" && isSetButtonClicked) {
        event.preventDefault();
        startButtonRef.current?.trigger();
        return;
      }
      if (event.key === "F9") {
        if (!isRakusatsuProcessingMsgFlg) return;
        event.preventDefault();
        if (rakusatsuConfirmOpen) {
          if (spnKbn == "1") {
            bidLiveBidEnd(true);
          } else {
            bidLiveAuctionEnd();
          }
          setRakusatsuConfirmOpen(false); // モーダルを閉じる
        } else {
          setRakusatsuConfirmOpen(true);
        }
      }
      if (event.key === "Enter" && isStartButtonClicked) {
        event.preventDefault();
        setIsLatestBidActive(false);
        priceButtonRef.current?.trigger();
      }
      if (event.key === "Shift" && isStartButtonClicked) {
        event.preventDefault();
        setIsLatestBidActive(false);
        onlinePriceButtonRef.current?.trigger();
      }
      if (event.key === "ArrowRight" && isCallButtonClicked) {
        lotBeforeAffterSearch(false);
        return;
      }
      if (event.key === "ArrowLeft" && isCallButtonClicked) {
        lotBeforeAffterSearch(true);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        plusRef.current?.trigger();
        return;
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        minusRef.current?.trigger();
        return;
      }
    },
    [
      furakusatsuConfirmOpen,
      spnKbn,
      bidLiveBidEnd,
      bidLiveAuctionEnd,
      setFuRakusatsuConfirmOpen,
      lotSearch,
      setIsCallDisabled,
      isCallButtonClicked,
      set,
      isSetButtonClicked,
      startButtonRef,
      rakusatsuConfirmOpen,
      setRakusatsuConfirmOpen,
      isStartButtonClicked,
      priceButtonRef,
      onlinePriceButtonRef,
      lotBeforeAffterSearch,
      plusRef,
      minusRef,
      isRakusatsuProcessingMsgFlg,
    ]
  );

  useEffect(() => {
    const listener = (e: Event) => {
      if (e instanceof KeyboardEvent) handleKeyDown(e);
    };
    window.addEventListener("keydown", listener, { capture: true });
    return () => window.removeEventListener("keydown", listener, { capture: true });
  }, [handleKeyDown]);

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.topLeft}>
          <div className={styles.labelRow}>
            <label className={styles.goodslabel}>{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              className={`${styles.select} ${inputSeatchErrors?.auctionSeq ? "bg-red-300" : ""}`}
              onChange={(value) => handleSearchKaisaiChange("auctionSeq", value)}
              selectedId={searchSelectedKaisai !== null ? String(searchSelectedKaisai) : ""}
              kaisaiStatus={5}
              spnKbns={typeof spnKbn === "string" ? [spnKbn] : spnKbn}
            />
          </div>

          <div className={styles.labelRow}>
            <label className={styles.goodslabel}>{texts.goods.goodsName}</label>
            <label id="goodsName" className={styles.goodsvalue}>
              {goodsData.goodsName || ""}
            </label>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              marginBottom: "20px",
            }}
          >
            <Image
              src={goodsData.thumbnailImageUrl || "/no_image.png"}
              alt=""
              fill
              quality={100}
              loading="lazy"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div className={styles.bottomLeft}>
          <NextLotListComponent
            nextLotList={nextLotList}
            receivedData={{ lot: searchLot }}
            userId={null}
            screenType="auctioneer"
          />
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.topRight}>
          <div className={styles.gridContainer}>
            <div>
              {spnKbn === "1" ? (
                <>
                  <span className={styles.sectionTitle}>入札単位</span>
                  {fetchBidUnitList.map((item) => (
                    <li key={item.seq} className={styles.bidItem}>
                      <span className={styles.listSpanLeft}>
                        {formatPriceWithCommas(item.unitFrom)}～{formatPriceWithCommas(item.unitTo)}
                      </span>
                      <span className={styles.listSpanRight}>
                        {formatPriceWithCommas(item.bitUnit)}
                      </span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <div className={styles.labelRow}>
                    <label className={styles.auctionlabel}>
                      {texts.goods.saiteiRakusatsuPrice}
                    </label>
                    <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}>
                      {saiteiRakusatsuPrice}
                    </label>
                  </div>
                  <div className={styles.labelRow}>
                    <label className={styles.auctionlabel}>
                      {texts.goods.farst_jizen_nyusatsu}
                    </label>
                    <label id="firstPreBidUserId" className={styles.auctionuserid}>
                      {firstPreBidUserId}
                    </label>
                    <label id="firstPreBidPrice" className={styles.auctionvalue}>
                      {firstPreBidPrice}
                    </label>
                  </div>
                  <div className={styles.labelRow}>
                    <label className={styles.auctionlabel}>
                      {texts.goods.second_jizen_nyusatsu}
                    </label>
                    <label id="secondPreBidUserId" className={styles.auctionuserid}>
                      {secondPreBidUserId}
                    </label>
                    <label id="secondPreBidPrice" className={styles.auctionvalue}>
                      {secondPreBidPrice}
                    </label>
                  </div>
                </>
              )}
            </div>

            <div>
              <span className={styles.sectionTitle}>オンライン入札履歴</span>
              <div className={styles.bidHistoryWrapper}>
                <ul className={styles.bidList}>
                  {onlineBidHistory.map((bid, index) => (
                    <li
                      key={index}
                      className={[
                        styles.bidItem,
                        index === 0 && isLatestBidActive ? styles.latestBid : "",
                      ].join(" ")}
                    >
                      <span className={styles.listSpanLeft}>
                        {spnKbn === "1" ? (
                          <>パドルNo: {bid.paddleNo}</>
                        ) : (
                          <>ユーザーID: {bid.userId}</>
                        )}
                      </span>
                      <span className={styles.listSpanRight}>
                        入札価格: {formatPriceWithCommas(bid.bidPrice)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <span className={styles.sectionTitle}>配信履歴</span>
              <div className={styles.bidHistoryWrapper}>
                <ul className={styles.bidList}>
                  {liveBidLog.map((bid, index) => (
                    <li key={index} className={styles.bidItem}>
                      <span className={styles.listSpanLeft}>
                        {spnKbn === "1" ? (
                          <>パドルNo: {bid.paddleNo}</>
                        ) : (
                          <>ユーザーID: {bid.userId}</>
                        )}
                      </span>
                      <span className={styles.listSpanRight}>
                        入札価格: {bid.bidKbn == "1" ? "事前 " : ""}
                        {formatPriceWithCommas(bid.bidPrice)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.centerRight}>
          <div className={styles.gridContainer4}>
            <div className={styles.currentInfoDiv}>
              <div>
                <span className={styles.currentInfoLabel}>現在価格：</span>
              </div>
              <div className={styles.currentInfoData}>
                <span>{displayCurrentPrice}</span>
              </div>
            </div>
            <div className={styles.currentInfoDiv}>
              <div>
                <span className={styles.currentInfoLabel}>現在権利者：</span>
              </div>
              <div className={styles.currentInfoData}>
                <span> {spnKbn === "1" ? <>{kenriPaddleNo}</> : <>{kenriUserId}</>}</span>
              </div>
            </div>
            <div className={styles.currentInfoDiv}>
              <div>
                <span className={styles.currentInfoLabel}>セリ幅：</span>
              </div>
              <div className={styles.currentInfoData}>
                <span>{bidUnit}</span>
              </div>
            </div>
            <div className={styles.currentInfoDiv}>
              <div>
                <span className={styles.currentInfoLabel}>オンライン参加者数：</span>
              </div>
              <div className={styles.currentInfoData}>
                <span>{connectionCount}</span>
              </div>
            </div>
          </div>
        </div>
        {executionPermission(350, 2) ? (
          <>
            <div className={styles.bottomRight}>
              <div className={styles.labelRow}>
                <div className={styles.leftButtons}>
                  <label htmlFor="lot" className={styles.goodslabel}>
                    {texts.goods.lot}
                  </label>
                  <input
                    id="lot"
                    type="text"
                    name="lot"
                    ref={lotInputRef}
                    value={searchLot}
                    onChange={handleSearchLotChange}
                    className={`border p-2 rounded h-10 w-40
                    ${inputSeatchErrors?.lot ? "bg-red-300" : ""}`}
                  />

                  <CallButton onClick={lotSearch} disabled={isCallDisabled} />
                  <LotBeforeAffterButton
                    onClick={() => lotBeforeAffterSearch(true)}
                    isBefore={true}
                    disabled={!isCallButtonClicked}
                  />
                  <LotBeforeAffterButton
                    onClick={() => lotBeforeAffterSearch(false)}
                    isBefore={false}
                    disabled={!isCallButtonClicked}
                  />
                </div>
                <div className={styles.rightButtons}>
                  <SetButton
                    disabled={!isCallButtonClicked}
                    onClick={set}
                    setAuctioneerFlg={setAuctioneerFlg}
                    isAuctioneerFlg={isAuctioneerFlg}
                    sendWebSocketMessage={sendWebSocketMessage}
                    currentPrice={currentPrice}
                    bidUnit={bidUnit}
                  />

                  <StartButton
                    ref={startButtonRef}
                    disabled={!isSetButtonClicked}
                    sendWebSocketMessage={sendWebSocketMessage}
                    kenriUserId={kenriUserId ?? null}
                    currentPrice={currentPrice}
                    nextPrice={nextPrice}
                    setLiveBidLog={setLiveBidLog}
                  />
                  <ConfirmDialog
                    open={clearConfirmOpen}
                    setOpen={setClearConfirmOpen}
                    description={texts.livemessage.confirmClear}
                    disabled={false}
                    buttonTitle={texts.button.liveClear}
                    className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40`}
                    dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-full w-40"
                    dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-full w-40 float-left"
                    onSubmit={clear}
                    buttonText={texts.button.liveClear}
                  />
                </div>
              </div>

              <div className={styles.labelRow}>
                <div className={styles.leftButtons}>
                  <div className={styles.msgDiv}>
                    {isBidComingSoonMsgFlg && <span>{texts.button.BidComingSoon}</span>}
                    {isRakusatsuProcessingMsgFlg && (
                      <span>{texts.livemessage.rakusatsuProcessMsg}</span>
                    )}
                  </div>
                </div>
                <div className={styles.rightButtons}>
                  {spnKbn == "1" && (
                    <div className={styles.priceSection}>
                      <div className={styles.priceGroup}>
                        <span className={styles.priceLabel}>次価格</span>
                        <input
                          type="text"
                          className={`${styles.priceInput} ${isNextPriceBelow ? "bg-red-300" : ""}`}
                          value={nextPrice}
                          onChange={(e) => {
                            setNextPrice(e.target.value);
                            setIsNextPriceBelow(false);
                          }}
                        />
                        <span>,000</span>

                        <span className={styles.priceLabel}>現在価格</span>
                        <input
                          type="text"
                          className={`${styles.priceInput} ${isNextPriceBelow ? "bg-red-300" : ""}`}
                          value={currentPrice}
                          ref={currentPriceInputRef}
                          onChange={(e) => {
                            setCurrentPrice(e.target.value);
                            setIsNextPriceBelow(false);
                            manualSetNextPrice(e.target.value);
                          }}
                        />
                        <span>,000</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {spnKbn == "1" && (
                <div className={styles.adjustButtons}>
                  <SerihabaButton
                    ref={plusRef}
                    isplus={true}
                    disabled={!isStartButtonClicked}
                    currentPrice={currentPrice}
                    nextPrice={nextPrice}
                    fetchGoodsData={fetchGoodsData}
                    fetchBidUnitList={fetchBidUnitList}
                    spnKbn={spnKbn}
                    setBidUnit={setBidUnit}
                    onUpdatePrices={(newCurrentPrice, newNextPrice) => {
                      setCurrentPrice(newCurrentPrice);
                      setNextPrice(newNextPrice);
                    }}
                  />

                  <SerihabaButton
                    ref={minusRef}
                    isplus={false}
                    disabled={!isStartButtonClicked}
                    currentPrice={currentPrice}
                    nextPrice={nextPrice}
                    fetchGoodsData={fetchGoodsData}
                    fetchBidUnitList={fetchBidUnitList}
                    spnKbn={spnKbn}
                    setBidUnit={setBidUnit}
                    onUpdatePrices={(newCurrentPrice, newNextPrice) => {
                      setCurrentPrice(newCurrentPrice);
                      setNextPrice(newNextPrice);
                    }}
                  />
                </div>
              )}

              <div className={styles.labelRow}>
                <div className={styles.leftButtons}>
                  <StatusButton
                    status={1}
                    disabled={!isStartButtonClicked}
                    sendWebSocketMessage={sendWebSocketMessage}
                    setLiveBidkekkaData={setLiveBidkekkaData}
                    liveBidLog={liveBidLog}
                    onlineBidHistory={onlineBidHistory}
                  />

                  <StatusButton
                    status={!isRakusatsuProcessingMsgFlg ? 2 : 3}
                    disabled={!isStartButtonClicked}
                    sendWebSocketMessage={sendWebSocketMessage}
                    setLiveBidkekkaData={setLiveBidkekkaData}
                    liveBidLog={liveBidLog}
                    onlineBidHistory={onlineBidHistory}
                    onFocus={() => {
                      if (!isRakusatsuProcessingMsgFlg) {
                        rakusatsuPaddleNoInputRef.current?.focus();
                      } else {
                        currentPriceInputRef.current?.focus();
                      }
                    }}
                  />
                </div>
                <div className={styles.rightButtons}>
                  {spnKbn == "1" && (
                    <>
                      <OnlinePriceButton
                        ref={onlinePriceButtonRef}
                        disabled={!isStartButtonClicked}
                        onlineBidHistory={onlineBidHistory}
                        fetchGoodsData={fetchGoodsData}
                        firstPreBidPrice={firstPreBidPrice}
                        firstPreBidUserId={firstPreBidUserId}
                        kenriUpdatePrice={kenriUpdatePrice}
                        kenriUserId={kenriUserId}
                        saiteiRakusatsuPrice={saiteiRakusatsuPrice}
                        sendWebSocketMessage={sendWebSocketMessage}
                        setCurrentPrice={setCurrentPrice}
                        setDisplayCurrentPrice={setDisplayCurrentPrice}
                        setNextPrice={setNextPrice}
                        setKenriUserId={setKenriUserId}
                        setKenriPaddleNo={setKenriPaddleNo}
                        setLiveBidkekkaData={setLiveBidkekkaData}
                        liveBidLog={liveBidLog}
                        setLiveBidLog={setLiveBidLog}
                        setIsBelowSaiteiPriceFlg={setIsBelowSaiteiPriceFlg}
                        spnKbn={spnKbn}
                        fetchBidUnitList={fetchBidUnitList}
                        nextPrice={nextPrice}
                        onButtonClick={() => setIsLatestBidActive(false)}
                      />

                      <CurrentPriceButton
                        ref={priceButtonRef}
                        disabled={!isStartButtonClicked}
                        setKenriUserId={setKenriUserId}
                        setKenriPaddleNo={setKenriPaddleNo}
                        currentPrice={currentPrice}
                        nextPrice={nextPrice}
                        sendWebSocketMessage={sendWebSocketMessage}
                        setDisplayCurrentPrice={setDisplayCurrentPrice}
                        liveBidLog={liveBidLog}
                        setLiveBidLog={setLiveBidLog}
                        setIsNextPriceBelow={setIsNextPriceBelow}
                        setLiveBidkekkaData={setLiveBidkekkaData}
                        onButtonClick={() => setIsLatestBidActive(false)}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className={styles.liveMessageDiv}>
                <label className={styles.goodslabel}>{texts.livemessage.message}</label>
                <LiveMessageListPullDown
                  className={styles.selectLiveMessage}
                  onChange={(value) => handleSetMessageChange(value)}
                />
                <MessageButton onClick={sendMessage} disabled={false} />
              </div>

              <div className={styles.labelRow}>
                <div className={styles.leftButtons}>
                  {spnKbn == "1" && (
                    <>
                      <span className={styles.priceLabel}>
                        落札者
                        <br />
                        パドル番号
                      </span>
                      <input
                        type="text"
                        ref={rakusatsuPaddleNoInputRef}
                        className={`${styles.paddleInput} ${
                          isRakusatsuPaddleNoError ? "bg-red-300" : ""
                        }`}
                        value={liveBidkekkaData.rakusatsuPaddleNo ?? ""}
                        onChange={(e) => {
                          handleRakusatsuPaddleNoChange(e.target.value);
                          setIsRakusatsuPaddleNoError(false);
                        }}
                      />
                      <AuctioneerConfirmDialog
                        open={rakusatsuConfirmOpen}
                        setOpen={setRakusatsuConfirmOpen}
                        disabled={!isRakusatsuProcessingMsgFlg}
                        description={`${texts.livemessage.updateSerikekkaData_1} ${
                          texts.livemessage.rakusatsu
                        }
                          ${
                            "\n" +
                            texts.livemessage.updateSerikekkaData_2 +
                            liveBidkekkaData.rakusatsuPaddleNo
                          }
                          ${
                            "\n" +
                            texts.livemessage.updateSerikekkaData_3 +
                            formatPriceWithCommas(Number(liveBidkekkaData.rakusatsuPrice))
                          }
                        `}
                        buttonTitle={texts.button.rakusatsu}
                        className={`bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full w-80 h-16 text-2xl text-white ${
                          !isRakusatsuProcessingMsgFlg ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-full w-40"
                        dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-full w-40 float-left"
                        onSubmit={() => bidLiveBidEnd(true)}
                        buttonText={texts.button.rakusatsu}
                      />
                    </>
                  )}
                  {spnKbn == "2" && (
                    <AuctioneerConfirmDialog
                      open={rakusatsuConfirmOpen}
                      setOpen={setRakusatsuConfirmOpen}
                      disabled={!isRakusatsuProcessingMsgFlg}
                      description={`${texts.livemessage.updateSerikekkaData_1} ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? texts.livemessage.rakusatsu
                          : texts.livemessage.furakusatsu
                      }
                      ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? "\n" +
                            texts.livemessage.updateSerikekkaData_2 +
                            liveBidkekkaData.rakusatsuUserId
                          : ""
                      }
                      ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? "\n" +
                            texts.livemessage.updateSerikekkaData_3 +
                            formatPriceWithCommas(Number(liveBidkekkaData.rakusatsuPrice))
                          : ""
                      }
                  `}
                      buttonTitle={texts.button.updateSerikekka}
                      className={`bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full w-80 h-16 text-2xl text-white ${
                        !isRakusatsuProcessingMsgFlg ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-full w-40"
                      dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-full w-40 float-left"
                      onSubmit={bidLiveAuctionEnd}
                      buttonText={texts.button.updateSerikekka}
                    />
                  )}
                </div>
                {spnKbn == "1" && (
                  <div className={styles.rightButtons}>
                    <AuctioneerConfirmDialog
                      open={furakusatsuConfirmOpen}
                      setOpen={setFuRakusatsuConfirmOpen}
                      disabled={!isRakusatsuProcessingMsgFlg}
                      description={`${texts.livemessage.updateSerikekkaData_1} ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? texts.livemessage.rakusatsu
                          : texts.livemessage.furakusatsu
                      }
                      ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? "\n" +
                            texts.livemessage.updateSerikekkaData_2 +
                            liveBidkekkaData.rakusatsuUserId
                          : ""
                      }
                      ${
                        liveBidkekkaData.auctionKekkaStatus === 2
                          ? "\n" +
                            texts.livemessage.updateSerikekkaData_3 +
                            formatPriceWithCommas(Number(liveBidkekkaData.rakusatsuPrice))
                          : ""
                      }
                  `}
                      buttonTitle={texts.button.furakusatsu}
                      className={`bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full w-80 h-16 text-2xl text-white ${
                        !isRakusatsuProcessingMsgFlg ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-full w-40"
                      dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-full w-40 float-left"
                      onSubmit={() => bidLiveBidEnd(false)}
                      buttonText={texts.button.furakusatsu}
                    />
                  </div>
                )}
              </div>

              <div className={styles.flowingMsgDiv}>
                <span key={marqueeKey} className={styles.marquee}>
                  {typeof msg === "string" ? msg : ""}
                </span>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default withAdminNoHeaderLayout(Page);
