//コンフィグ
import { texts } from "@/config/texts.ja";

interface LotNavigationButtonProps {
  type: "before" | "after";
  onClick?: () => void;
}

export function LotNavigationButton({ type, onClick }: LotNavigationButtonProps) {
  const buttonText = type === "before" ? "前LOT" : "後LOT";

  return (
    <button
      className="lg:ml-2.5 mt-2 lg:mt-0 bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-40"
      onClick={onClick}
    >
      <span>{buttonText}</span>
    </button>
  );
}
