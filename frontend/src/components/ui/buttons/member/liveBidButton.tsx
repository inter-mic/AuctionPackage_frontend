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
      className={`bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full w-80 h-20 text-2xl ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
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
