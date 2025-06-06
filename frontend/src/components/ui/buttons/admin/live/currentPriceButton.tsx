//コンフィグ
import { texts } from "@/config/texts";
import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { TLiveBidLog } from "@/types/admin/live/auctioneer";
import { formatPriceMultiplication, formatPriceWithCommas } from "@/components/common/PriceUtils";

export interface PriceButtonHandle {
  trigger: () => void;
}

interface PriceButtonProps {
  disabled: boolean;
  setKenriPaddleNo: (paddleNo: string | null) => void;
  currentPrice: string;
  nextPrice: string;
  sendWebSocketMessage: (type: string, data: any) => void;
  setDisplayCurrentPrice: (price: string) => void;
  liveBidLog: TLiveBidLog[];
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
}

export const CurrentPriceButton = forwardRef<PriceButtonHandle, PriceButtonProps>(
  (
    {
      disabled,
      setKenriPaddleNo,
      currentPrice,
      nextPrice,
      sendWebSocketMessage,
      setDisplayCurrentPrice,
      liveBidLog,
      setLiveBidLog,
    },
    ref
  ) => {
    const [sendWS, setSendWS] = useState<boolean>(false);
    const handleClick = () => {
      const now = new Date();

      // ── 1. 価格を計算 ──
      const price = formatPriceWithCommas(
        formatPriceMultiplication(currentPrice?.replace(/,/g, "")).toString()
      );

      // ── 2. 画面上の「現在価格」「表示用現在価格」を更新 ──
      setDisplayCurrentPrice(price);
      setKenriPaddleNo("会場");

      // ── 3. 「配信履歴 (liveBidLog)」にこの入札を追加 ──
      setLiveBidLog((prevLog) => [
        {
          userId: "",
          paddleNo: "",
          bidPrice: price,
          bidTime: now.toLocaleString(),
          bidKbn: "",
        },
        ...prevLog,
      ]);

      // ── 4. sendWSフラグTrue ──
      setSendWS(true); // WS送信タイミングが共通のliveBidLog更新時であるため
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
