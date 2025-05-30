//コンフィグ
import { texts } from "@/config/texts";

interface Props {
  onClick?: () => void;
  status: number;
  disabled: boolean;
}

export function ResultsButton({ onClick, status, disabled }: Props) {
  let buttonText = "";
  if (status === 1) {
    buttonText = texts.button.furakusatsu;
  } else if (status === 2) {
    buttonText = texts.button.rakusatsu;
  } else if (status === 3) {
    buttonText = texts.button.updateSerikekka;
  }

  return (
    <button
      className={`bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{buttonText}</span>
    </button>
  );
}
