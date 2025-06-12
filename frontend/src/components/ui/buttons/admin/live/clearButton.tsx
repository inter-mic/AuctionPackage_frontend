//コンフィグ
import { texts } from "@/config/texts.ja";

interface Props {
  onClick?: () => void;
  disabled: boolean;
}

export function ClearButton({ onClick, disabled }: Props) {
  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{texts.button.liveClear}</span>
    </button>
  );
}
