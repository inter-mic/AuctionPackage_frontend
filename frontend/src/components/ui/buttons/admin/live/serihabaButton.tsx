import { texts } from "@/config/texts.ja";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  formatPriceDivision,
  formatPriceMultiplication,
  formatPriceWithCommas,
} from "@/components/common/PriceUtils";
import { getBidUnit } from "@/components/admin/live/getBidUnit";
import { TMtLiveBidUnit } from "@/types/common/bidUnit";
export interface SerihabaButtonHandle {
  trigger: () => void;
}
interface SerihabaButtonProps {
  isplus: boolean;
  disabled: boolean;
  currentPrice: string;
  nextPrice: string;
  fetchGoodsData: { bidUnit: string | null };
  fetchBidUnitList: TMtLiveBidUnit[];
  setBidUnit: (price: string) => void;
  onUpdatePrices: (current: string, next: string) => void;
  spnKbn: string | string[] | undefined;
}
export const SerihabaButton = forwardRef<SerihabaButtonHandle, SerihabaButtonProps>(
  (
    {
      isplus,
      disabled,
      currentPrice,
      nextPrice,
      fetchGoodsData,
      onUpdatePrices,
      fetchBidUnitList,
      setBidUnit,
      spnKbn,
    },
    ref
  ) => {
    const handleClick = () => {
      const current = formatPriceMultiplication(currentPrice);
      const fetchBitUnit = getBidUnit(
        spnKbn,
        fetchGoodsData?.bidUnit,
        fetchBidUnitList,
        current.toString()
      );
      if (fetchBitUnit) {
        const bidUnit = Number(fetchBitUnit);
        setBidUnit(formatPriceWithCommas(bidUnit));

        const newCurrentPrice = isplus ? current + bidUnit : current - bidUnit;

        const next = formatPriceMultiplication(nextPrice);
        const newNextPrice = isplus ? next + bidUnit : next - bidUnit;

        onUpdatePrices(
          formatPriceDivision(newCurrentPrice.toString()),
          formatPriceDivision(newNextPrice.toString())
        );
      }
    };

    // 外部から trigger() を呼べるようにする
    useImperativeHandle(ref, () => ({
      trigger: handleClick,
    }));

    return (
      <button
        className={`bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-full w-40 text-xl text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        {isplus ? (
          <span>{texts.button.plusSerihaba}</span>
        ) : (
          <span>{texts.button.minusSerihaba}</span>
        )}
      </button>
    );
  }
);
SerihabaButton.displayName = "SerihabaButton";
