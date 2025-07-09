//コンフィグ
import { texts } from "@/config/texts.ja";
import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { TLiveBidLog } from "@/types/admin/live/auctioneer";
import { formatPriceMultiplication, formatPriceWithCommas } from "@/components/common/PriceUtils";
import { toast } from "react-toastify";
import { LiveBidKekkaData } from "@/types/admin/live/register";

export interface PriceButtonHandle {
  trigger: () => void;
}

interface PriceButtonProps {
  disabled: boolean;
  setKenriUserId: (id: number | null) => void;
  setKenriPaddleNo: (paddleNo: string | null) => void;
  currentPrice: string;
  nextPrice: string;
  sendWebSocketMessage: (type: string, data: any) => void;
  setDisplayCurrentPrice: (price: string) => void;
  liveBidLog: TLiveBidLog[];
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
  setIsNextPriceBelow: (flg: boolean) => void;
  setLiveBidkekkaData: React.Dispatch<React.SetStateAction<LiveBidKekkaData>>;
  onButtonClick?: () => void;
}

export const CurrentPriceButton = forwardRef<PriceButtonHandle, PriceButtonProps>(
  (
    {
      disabled,
      setKenriUserId,
      setKenriPaddleNo,
      currentPrice,
      nextPrice,
      sendWebSocketMessage,
      setDisplayCurrentPrice,
      liveBidLog,
      setLiveBidLog,
      setIsNextPriceBelow,
      setLiveBidkekkaData,
      onButtonClick,
    },
    ref
  ) => {
    const [sendWS, setSendWS] = useState<boolean>(false);
    const handleClick = () => {
      // ボタンクリック時のコールバックを実行
      onButtonClick?.();
      
      const now = new Date();

      // ── 0. 価格チェック ──
      // 現在価格配信時に次価格が現在価格より低い場合はアラート表示
      if (Number(nextPrice) <= Number(currentPrice)) {
        setIsNextPriceBelow(true);
        toast.error(texts.message.isNextPriceBelow);
        return;
      }

      // ── 1. 価格を計算 ──
      const price = formatPriceWithCommas(
        formatPriceMultiplication(currentPrice?.replace(/,/g, "")).toString()
      );

      // ── 2. 画面上の「現在価格」「表示用現在価格」を更新 ──
      setDisplayCurrentPrice(price);
      setKenriUserId(null);
      setKenriPaddleNo("会場");

      // ── 3. 「配信履歴 (liveBidLog)」にこの入札を追加 ──
      setLiveBidLog((prevLog) => [
        {
          userId: "",
          paddleNo: "",
          bidPrice: price,
          bidTime: now.toLocaleString(),
          bidKbn: "10",
        },
        ...prevLog,
      ]);

      // ── 4. sendWSフラグTrue ──
      setSendWS(true); // WS送信タイミングが共通のliveBidLog更新時であるため

      // ── 5. 落札結果用データを更新 ──
      setLiveBidkekkaData((prev) => ({
        ...prev,
        rakusatsuPrice: formatPriceMultiplication(currentPrice).toString(),
      }));
    };

    useEffect(() => {
      if (liveBidLog.length > 0 && sendWS) {
        sendWebSocketMessage("updatePrice", {
          nextPrice: formatPriceMultiplication(nextPrice),
          currentPrice: formatPriceMultiplication(currentPrice),
          bidPrice: liveBidLog[0].bidPrice,
          bidTime: liveBidLog[0].bidTime,
        });
        setSendWS(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liveBidLog]);

    useImperativeHandle(ref, () => ({
      trigger: handleClick,
    }));

    return (
      <button
        className={`bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span>{texts.button.currentPrice}</span>
      </button>
    );
  }
);

CurrentPriceButton.displayName = "CurrentPriceButton";
