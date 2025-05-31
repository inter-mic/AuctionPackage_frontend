//コンフィグ
import { texts } from "@/config/texts";
import React, { forwardRef, useImperativeHandle } from "react";
import { TLiveBidLog } from "@/types/admin/live/auctioneer";
import {
  formatPriceDivision,
  formatPriceMultiplication,
  formatPriceWithCommas,
  formatPriceNum,
} from "@/components/common/PriceUtils";
export interface PriceButtonHandle {
  trigger: () => void;
}

interface PriceButtonProps {
  disabled: boolean;
  currentPrice: string;
  nextPrice: string;
  sendWebSocketMessage: (type: string, data: any) => void;
  setDisplayCurrentPrice: (price: string) => void;
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
}

export const CurrentPriceButton = forwardRef<PriceButtonHandle, PriceButtonProps>(
  (
    {
      disabled,
      currentPrice,
      nextPrice,
      sendWebSocketMessage,
      setDisplayCurrentPrice,
      setLiveBidLog,
    },
    ref
  ) => {
    const handleClick = () => {
      const now = new Date();

      sendWebSocketMessage("updatePrice", {
        nextPrice: formatPriceMultiplication(nextPrice),
        currentPrice: formatPriceMultiplication(currentPrice),
      });

      const price = formatPriceWithCommas(
        formatPriceMultiplication(currentPrice?.replace(/,/g, "")).toString()
      );
      setDisplayCurrentPrice(price);

      setLiveBidLog((prevLog) => [
        {
          userId: "",
          bidPrice: price,
          bidTime: now.toLocaleString(),
          bidKbn: "",
        },
        ...prevLog,
      ]);
    };

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
