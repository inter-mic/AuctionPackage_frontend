//コンフィグ
import { texts } from "@/config/texts.ja";

interface CallButtonProps {
  onClick?: () => void;
  disabled: boolean;
}

export function CallButton({ onClick, disabled }: CallButtonProps) {
  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{texts.button.call}(F2)</span>
    </button>
  );
}
