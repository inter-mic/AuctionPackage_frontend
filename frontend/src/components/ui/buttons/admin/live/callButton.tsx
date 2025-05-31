//コンフィグ
import { texts } from "@/config/texts";

interface CallButtonProps {
  onClick?: () => void;
}

export function CallButton({ onClick }: CallButtonProps) {
  return (
    <button
      className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40"
      onClick={onClick}
    >
      <span>{texts.button.call}(F2)</span>
    </button>
  );
}
