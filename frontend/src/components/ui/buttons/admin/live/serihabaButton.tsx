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
      // 文字列価格を数値に変換
      const next = formatPriceMultiplication(nextPrice);
      const current = formatPriceMultiplication(currentPrice);

      // 増額なら next、減額なら current - 1 を基準に入札単位を取得
      const baseForUnit = isplus ? next : current - 1;
      const fetchBitUnit = getBidUnit(
        spnKbn,
        fetchGoodsData?.bidUnit,
        fetchBidUnitList,
        baseForUnit.toString()
      );

      if (fetchBitUnit) {
        const bidUnit = Number(fetchBitUnit);
        // UIに表示する入札単位をセット
        setBidUnit(formatPriceWithCommas(bidUnit));

        // 新しい nextPrice と currentPrice を計算
        const newNextPrice = isplus
          ? next + bidUnit   // 増額後の次価格
          : current;         // 減額時は旧 currentPrice を次価格に回す

        const newCurrentPrice = isplus
          ? next             // 増額時は旧 nextPrice が新 currentPrice
          : current - bidUnit; // 減額時は current から入札単位を引く

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
