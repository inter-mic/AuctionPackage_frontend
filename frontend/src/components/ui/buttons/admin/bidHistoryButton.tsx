import { texts } from "@/config/texts.ja";

interface BidHistoryButtonProps {
  goodsId: number;
  onClick: () => void;
}

export function BidHistoryButton({ onClick }: BidHistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-400 hover:bg-opacity-50  font-bold text-white py-2 px-4 rounded-lg w-40"
    >
      <span>{texts.button.bidHistory}</span>
    </button>
  );
}
