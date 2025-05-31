import { texts } from "@/config/texts";
import React, { forwardRef, useImperativeHandle } from "react";
import { formatPriceDivision, formatPriceMultiplication } from "@/components/common/PriceUtils";

export interface SerihabaButtonHandle {
  trigger: () => void;
}
interface SerihabaButtonProps {
  isplus: boolean;
  disabled: boolean;
  currentPrice: string;
  nextPrice: string;
  fetchGoodsData: { bidUnit: string | null };
  onUpdatePrices: (current: string, next: string) => void;
}
export const SerihabaButton = forwardRef<SerihabaButtonHandle, SerihabaButtonProps>(
  ({ isplus, disabled, currentPrice, nextPrice, fetchGoodsData, onUpdatePrices }, ref) => {
    const handleClick = () => {
      const bidUnit = Number(fetchGoodsData?.bidUnit?.replace(/,/g, "") || "0");

      const current = formatPriceMultiplication(currentPrice);
      const newCurrentPrice = isplus ? current + bidUnit : current - bidUnit;

      const next = formatPriceMultiplication(nextPrice);
      const newNextPrice = isplus ? next + bidUnit : next - bidUnit;

      onUpdatePrices(
        formatPriceDivision(newCurrentPrice.toString()),
        formatPriceDivision(newNextPrice.toString())
      );
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
