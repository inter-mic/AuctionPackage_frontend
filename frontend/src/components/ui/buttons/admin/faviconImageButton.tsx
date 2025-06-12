import { useCallback } from "react";
import { texts } from "@/config/texts.ja";
interface RegistButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export function FaviconImageRegistButton({ onClick }: RegistButtonProps) {
  return (
    <button
      className="bg-yellow-500  hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-60"
      onClick={onClick}
    >
      <span>{texts.button.faviconImageRegist}</span>
    </button>
  );
}

interface DeleteButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
export const FaviconImageDeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-red-500  hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-60"
      onClick={onClick}
    >
      <span>{texts.button.faviconImageDelete}</span>
    </button>
  );
};
