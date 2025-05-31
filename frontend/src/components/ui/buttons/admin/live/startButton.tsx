//コンフィグ
import { formatPriceMultiplication } from "@/components/common/PriceUtils";
import React, { forwardRef, useImperativeHandle } from "react";

import { useCommonSetup } from "@/hooks/useCommonSetup";

import { TLiveBidLog } from "@/types/admin/live/auctioneer";

interface StartButtonProps {
  disabled: boolean;
  sendWebSocketMessage: (type: string, payload: any) => void;
  kenriUserId: number | null;
  currentPrice: string;
  nextPrice: string;
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
}
export interface StartButtonHandle {
  trigger: () => void;
}

export const StartButton = forwardRef<StartButtonHandle, StartButtonProps>(
  (
    { disabled, sendWebSocketMessage, kenriUserId, currentPrice, nextPrice, setLiveBidLog },
    ref
  ) => {
    const { texts } = useCommonSetup();
    const handleStart = async () => {
      sendWebSocketMessage("start", {
        nextPrice: formatPriceMultiplication(nextPrice),
        currentPrice: formatPriceMultiplication(currentPrice),
      });

      if (kenriUserId) {
        const now = new Date();
        setLiveBidLog((prevLog) => [
          {
            userId: kenriUserId.toString(),
            bidPrice: currentPrice,
            bidTime: now.toLocaleString(),
            bidKbn: "1",
          },
          ...prevLog,
        ]);
      }
    };

    // 外部から trigger() を呼べるようにする
    useImperativeHandle(ref, () => ({
      trigger: handleStart,
    }));

    return (
      <button
        className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleStart}
        disabled={disabled}
      >
        <span>{texts.button.start}</span>
      </button>
    );
  }
);

StartButton.displayName = "StartButton";
