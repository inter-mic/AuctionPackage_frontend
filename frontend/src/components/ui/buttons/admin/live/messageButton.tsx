//コンフィグ
import { texts } from "@/config/texts.ja";

interface MessageButtonProps {
  onClick?: () => void;
  disabled: boolean;
}

export function MessageButton({ onClick, disabled }: MessageButtonProps) {
  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{texts.button.haishin}</span>
    </button>
  );
}
