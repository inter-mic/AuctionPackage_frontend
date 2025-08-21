import React from "react";

type Props = {
  count: number;
  resultCountText: string;
  totalPrice?: string;
  totalPriceLabel?: string;
};

export const MyPageResultCount: React.FC<Props> = ({
  count,
  resultCountText,
  totalPrice,
  totalPriceLabel,
}) => {
  return (
    <div className="w-full flex flex-row justify-between items-center p-4">
      <div className="text-left">
        {count} {resultCountText}
      </div>
      {totalPrice && totalPriceLabel && (
        <div className="text-right">
          <span className="font-bold">
            {totalPriceLabel} : {totalPrice}
          </span>
        </div>
      )}
    </div>
  );
};
