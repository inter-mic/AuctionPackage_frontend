import { texts } from "@/config/texts.ja";

interface SearchButtonProps {
  onClick?: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
      onClick={onClick}
    >
      <span>{texts.button.search}</span>
    </button>
  );
}
