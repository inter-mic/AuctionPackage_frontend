//コンフィグ
import { useLocale } from "@/hooks/useLocale";
import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { formatPriceDivision, formatPriceMultiplication, formatPriceWithCommas } from "@/components/common/PriceUtils";
import { TBidHisotry, TLiveBidLog } from "@/types/admin/live/auctioneer";
import { LiveBidKekkaData } from "@/types/admin/live/register";
import { getBidUnit } from "@/components/admin/live/getBidUnit";
import { TMtLiveBidUnit } from "@/types/common/bidUnit";

export interface OnlinePriceButtonHandle {
  trigger: () => void;
}

interface OnlinePriceButtonProps {
  disabled: boolean;
  onlineBidHistory: TBidHisotry[];
  fetchGoodsData: any;
  firstPreBidPrice: string;
  firstPreBidUserId: number | null | undefined;
  kenriUpdatePrice: string;
  kenriUserId: number | null | undefined;
  saiteiRakusatsuPrice: string;
  sendWebSocketMessage: (type: string, data: any) => void;
  setCurrentPrice: (price: string) => void;
  setDisplayCurrentPrice: (price: string) => void;
  setNextPrice: (price: string) => void;
  setKenriUserId: (id: number | null) => void;
  setKenriPaddleNo: (paddleNo: string | null) => void;
  setLiveBidkekkaData: React.Dispatch<React.SetStateAction<LiveBidKekkaData>>;
  liveBidLog: TLiveBidLog[];
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
  setIsBelowSaiteiPriceFlg: (flg: boolean) => void;
  spnKbn: string | string[] | undefined;
  fetchBidUnitList: TMtLiveBidUnit[];
  nextPrice: string;
  onButtonClick?: () => void;
}

export const OnlinePriceButton = forwardRef<OnlinePriceButtonHandle, OnlinePriceButtonProps>(
  (
    {
      disabled,
      onlineBidHistory,
      fetchGoodsData,
      firstPreBidPrice,
      firstPreBidUserId,
      kenriUpdatePrice,
      kenriUserId,
      saiteiRakusatsuPrice,
      sendWebSocketMessage,
      setCurrentPrice,
      setDisplayCurrentPrice,
      setNextPrice,
      setKenriUserId,
      setKenriPaddleNo,
      setLiveBidkekkaData,
      liveBidLog,
      setLiveBidLog,
      setIsBelowSaiteiPriceFlg,
      spnKbn,
      fetchBidUnitList,
      nextPrice,
      onButtonClick,
    },
    ref
  ) => {
    const [sendWS, setSendWS] = useState<boolean>(false);
    const [queuedPayload, setQueuedPayload] = useState<{
      bidUserId: string;
      kenriUserId: number | null | undefined;
      kenriPaddleNo: string | null | undefined;
      nextPrice: string;
      currentPrice: string;
      isBelowSaiteiPriceFlg: boolean;
      isBidDisabled : boolean;
    } | null>(null);
    const { texts } = useLocale();
    const handleClick = () => {
      // ボタンクリック時のコールバックを実行
      onButtonClick?.();
      
      // ── 1. onlineBidHistory[0] が必ず存在することをチェック ──
      if (onlineBidHistory.length === 0) {
        return;
      }
      const now = new Date();
      const newOnlineBid = onlineBidHistory[0];

      // ── 2. 価格・セリ幅などを計算 ──
      const onlineBidPrice = newOnlineBid.bidPrice;
      const next = formatPriceMultiplication(nextPrice);
      const fetchBitUnit = getBidUnit(
        spnKbn,
        fetchGoodsData?.bidUnit,
        fetchBidUnitList,
        next.toString()
      );
      const bidUnit = Number(fetchBitUnit);

      // ── 3. 画面上の「現在価格」「表示用現在価格」を更新 ──
      setCurrentPrice(formatPriceDivision(onlineBidPrice));
      setDisplayCurrentPrice(formatPriceWithCommas(onlineBidPrice));

      // ── 4. 新しい最高落札者（権利者）を計算 ──
      const newBidPriceNumber = Number(onlineBidPrice);
      const firstPreBidPriceNumber = Number(firstPreBidPrice.replace(/,/g, ""));
      const newHighestUserId =
        newBidPriceNumber <= firstPreBidPriceNumber
          ? firstPreBidUserId
          : Number(newOnlineBid.userId);
      const newHighestBidKbn = newBidPriceNumber <= firstPreBidPriceNumber ? "1" : "11";

      // ── 5. 新しい権利者 ID を計算して state 更新 ──
      const calculatedKenriUserId =
        newBidPriceNumber > Number(kenriUpdatePrice)
          ? Number(newOnlineBid.userId)
          : newBidPriceNumber === Number(kenriUpdatePrice) && !kenriUserId
          ? Number(newOnlineBid.userId)
          : kenriUserId;
      if (calculatedKenriUserId != null) {
        setKenriUserId(calculatedKenriUserId);
      }
      setKenriPaddleNo(newOnlineBid.paddleNo);

      // ── 6. 落札結果用データを更新 ──
      setLiveBidkekkaData((prev) => ({
        ...prev,
        rakusatsuUserId: calculatedKenriUserId ?? null,
        rakusatsuPrice: calculatedKenriUserId ? newBidPriceNumber.toString() : null,
        auctionKekkaStatus: calculatedKenriUserId == null ? 1 : 2,
      }));

      // ── 7. 次の入札価格を計算 ──
      const nextPriceCalc = (newBidPriceNumber + bidUnit).toString();
      setNextPrice(formatPriceDivision(nextPriceCalc));

      // ── 8. 最低落札価格を下回っているかどうか ──
      const isBelowFlg = Number(saiteiRakusatsuPrice.replace(/,/g, "")) > newBidPriceNumber;
      setIsBelowSaiteiPriceFlg(isBelowFlg);

      // ── 9. 「配信履歴 (liveBidLog)」にこの入札を追加 ──
      const addedLog: TLiveBidLog = {
        userId: newHighestUserId ? newHighestUserId.toString() : "",
        paddleNo: newOnlineBid.paddleNo,
        bidPrice: newOnlineBid.bidPrice,
        bidTime: now.toLocaleString(),
        bidKbn: newHighestBidKbn, // 事前入札なら "1"、上書きなら "11"
      };
      setLiveBidLog((prevLog) => [addedLog, ...prevLog]);

      // ── 10. 送るべきペイロードを queuedPayload に一時保持 ──
      setQueuedPayload({
        bidUserId: newOnlineBid.userId,
        kenriUserId: newHighestUserId,
        kenriPaddleNo: newOnlineBid.paddleNo,
        nextPrice: nextPriceCalc,
        currentPrice: onlineBidPrice,
        isBelowSaiteiPriceFlg: isBelowFlg,
        isBidDisabled : false,
      });

      // ── 11. sendWSフラグTrue ──
      setSendWS(true); // WS送信タイミングが共通のliveBidLog更新時であるため
    };

    useEffect(() => {
      if (liveBidLog.length > 0 && sendWS) {
        // ログが新たに追加されたときにだけ一度 send
        sendWebSocketMessage("updatePrice", queuedPayload);
        setQueuedPayload(null);
      }
      setSendWS(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liveBidLog]);

    useImperativeHandle(ref, () => ({
      trigger: handleClick,
    }));

    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span>{texts.button.onlinePrice}</span>
      </button>
    );
  }
);
OnlinePriceButton.displayName = "OnlinePriceButton";
