import { useLocale } from "@/hooks/useLocale";
interface LiveBidButtonProps {
  onClick?: () => void;
  disabled: boolean;
  text: string;
}

export function LiveBidButton({ onClick, disabled, text }: LiveBidButtonProps) {
  const { texts } = useLocale();
  return (
    <button
      className={`text-white py-2 px-4 rounded-full w-80 h-20 text-2xl transition-all duration-150 transform ${
        disabled 
          ? "bg-gray-300 cursor-not-allowed shadow-none" 
          : "bg-yellow-500 shadow-[0_8px_0_#d97706] active:shadow-[0_2px_0_#d97706] active:translate-y-2"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>
        {text} {texts.live.bid}
      </span>
    </button>
  );
}
