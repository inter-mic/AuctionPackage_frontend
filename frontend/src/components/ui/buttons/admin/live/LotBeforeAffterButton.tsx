//コンフィグ
import { texts } from "@/config/texts.ja";

interface CallButtonProps {
  onClick?: () => void;
  isBefore: boolean;
  disabled: boolean;
}

export function LotBeforeAffterButton({ onClick, isBefore, disabled }: CallButtonProps) {
  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {isBefore ? <span>{texts.button.beforeLot}</span> : <span>{texts.button.affterLot}</span>}
    </button>
  );
}
