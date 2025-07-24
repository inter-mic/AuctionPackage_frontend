//コンフィグ
import { texts } from "@/config/texts.ja";

interface ClearButtonProps {
  onClick?: () => void;
}

export function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      className=" bg-white border border-solid border-yellow-500 text-yellow-500 font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
      onClick={onClick}
    >
      <span>{texts.button.clear}</span>
    </button>
  );
}
