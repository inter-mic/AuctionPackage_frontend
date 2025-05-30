//コンフィグ
import { texts } from "@/config/texts";

interface Props {
  onClick?: () => void;
  status: number;
  disabled: boolean;
}

export function StatusButton({ onClick, status, disabled }: Props) {
  let buttonText = "";
  if (status === 1) {
    buttonText = texts.button.BidComingSoon;
  } else if (status === 2) {
    buttonText = texts.button.BidFinush;
  } else if (status === 3) {
    buttonText = texts.button.rakusatsuProcess;
  } else if (status === 4) {
    buttonText = texts.button.bidRestart;
  }

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{buttonText}</span>
    </button>
  );
}
