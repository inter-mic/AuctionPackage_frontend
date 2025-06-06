//コンフィグ
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { formatPriceMultiplication, formatPriceNum } from "@/components/common/PriceUtils";
interface SetButtonProps {
  onClick?: () => void;
  disabled: boolean;
  setAuctioneerFlg: React.Dispatch<React.SetStateAction<boolean>>;
  isAuctioneerFlg: boolean;
  sendWebSocketMessage: (type: string, payload: any) => void;
  currentPrice: string;
  bidUnit: string;
}

export function SetButton({
  onClick,
  disabled,
  setAuctioneerFlg,
  isAuctioneerFlg,
  sendWebSocketMessage,
  currentPrice,
  bidUnit,
}: SetButtonProps) {
  const { texts, useEffect } = useCommonSetup();
  const handleClick = async () => {
    setAuctioneerFlg(true);
  };

  useEffect(() => {
    if (isAuctioneerFlg) {
      sendWebSocketMessage("set", {
        currentPrice: formatPriceMultiplication(currentPrice),
        bidUnit: formatPriceNum(bidUnit),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuctioneerFlg]);

  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span>{texts.button.set}</span>
    </button>
  );
}
