//コンフィグ
import { texts } from "@/config/texts";

import React, { forwardRef, useImperativeHandle } from "react";
import {
  formatPriceDivision,
  formatPriceMultiplication,
  formatPriceWithCommas,
} from "@/components/common/PriceUtils";

import { TBidHisotry, TLiveBidLog } from "@/types/admin/live/auctioneer";
import { LiveBidKekkaData, initialLiveBidKekkaData } from "@/types/admin/live/register";

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
  setLiveBidLog: React.Dispatch<React.SetStateAction<TLiveBidLog[]>>;
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
      setLiveBidLog,
    },
    ref
  ) => {
    const now: Date = new Date();
    const handleClick = () => {
      if (onlineBidHistory.length === 0) {
        return;
      }

      const newOnlineBid = onlineBidHistory[0];
      const onlineBidPrice = newOnlineBid.bidPrice;
      const bidUnit = Number(fetchGoodsData?.bidUnit?.replace(/,/g, "") || "0");
      setCurrentPrice(formatPriceDivision(newOnlineBid.bidPrice));

      setDisplayCurrentPrice(formatPriceWithCommas(newOnlineBid.bidPrice));

      const newBidPriceNumber = Number(newOnlineBid.bidPrice);
      const firstPreBidPriceNumber = Number(firstPreBidPrice.replace(/,/g, ""));
      const newHighestUserId =
        newBidPriceNumber <= firstPreBidPriceNumber
          ? firstPreBidUserId
          : Number(newOnlineBid.userId);
      const newHighestBidKbn = newBidPriceNumber <= firstPreBidPriceNumber ? "1" : "2";

      const newKenriUserId =
        newBidPriceNumber > Number(kenriUpdatePrice)
          ? Number(newOnlineBid.userId)
          : newBidPriceNumber == Number(kenriUpdatePrice) && !kenriUserId
          ? Number(newOnlineBid.userId)
          : kenriUserId;
      if (newKenriUserId != undefined && newKenriUserId != null) {
        setKenriUserId(newKenriUserId);
      }
      setKenriPaddleNo(newOnlineBid.paddleNo);

      setLiveBidkekkaData((prev) => ({
        ...prev,
        rakusatsuUserId: newKenriUserId,
        rakusatsuPrice: newKenriUserId ? newBidPriceNumber.toString() : null,
        auctionKekkaStatus: newKenriUserId == null ? 1 : 2,
      }));

      const nextPriceCalculated = (Number(onlineBidPrice) + Number(bidUnit)).toString();
      setNextPrice(formatPriceDivision(nextPriceCalculated));

      const isBelowSaiteiPrice =
        Number(saiteiRakusatsuPrice.replace(/,/g, "")) > Number(onlineBidPrice);

      sendWebSocketMessage("updatePrice", {
        bidUserId: newOnlineBid.userId,
        kenriUserId: newKenriUserId,
        nextPrice: nextPriceCalculated,
        currentPrice: newOnlineBid.bidPrice,
        isBelowSaiteiPriceFlg: isBelowSaiteiPrice,
      });

      setLiveBidLog((prevLog) => [
        {
          userId: newHighestUserId ? newHighestUserId.toString() : "",
          paddleNo: newOnlineBid.paddleNo,
          bidPrice: newOnlineBid.bidPrice,
          bidTime: now.toLocaleString(),
          bidKbn: newHighestBidKbn,
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
        <span>{texts.button.onlinePrice}</span>
      </button>
    );
  }
);
