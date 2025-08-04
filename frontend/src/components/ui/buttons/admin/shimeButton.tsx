import { useCallback } from "react";
import { texts } from "@/config/texts.ja";
//API
import useShimeOnOffAPI from "@/hooks/api/admin/auction/useShimeOnOffAPI";

interface ShimeButtonProps {
  auctionSeq: number;
  onUpdate: (auctionSeq: number, shimeFlg: boolean) => void;
}

export const ShimeOnButton: React.FC<ShimeButtonProps> = ({ auctionSeq }) => {
  const { shimeOnOffAPI } = useShimeOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      await shimeOnOffAPI(auctionSeq, true);
    },
    [auctionSeq, shimeOnOffAPI]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.shimeOn}</span>
    </button>
  );
};

export const ShimeOffButton: React.FC<ShimeButtonProps> = ({ auctionSeq }) => {
  const { shimeOnOffAPI } = useShimeOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      await shimeOnOffAPI(auctionSeq, false);
    },
    [auctionSeq, shimeOnOffAPI]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.shimeOff}</span>
    </button>
  );
};
