import React from "react";
import { useCommonSetup } from "@/hooks/useCommonSetup";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
type Props = {
  count: number;
  totalPrice?: string;
  totalPriceLabel?: string;
};

export const MyPageResultCount: React.FC<Props> = ({ count, totalPrice, totalPriceLabel }) => {
  const { texts } = useCommonSetup();

  return (
    <div className="w-full flex flex-row justify-between items-center p-4">
      <div className="text-left">
        {count.toLocaleString()} {texts.label.resultCount}
      </div>
      {totalPrice && totalPriceLabel && (
        <div className="text-right">
          <span>
            {totalPriceLabel} :
            <span className="text-xl font-bold mx-1">
              <CurrencyYenIcon />
              {totalPrice}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
