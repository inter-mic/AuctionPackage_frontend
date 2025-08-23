//コンフィグ
import { useLocale } from "@/hooks/useLocale";
import buttonStyles from "@/styles/Button.module.css";
interface SearchButtonProps {
  onClick?: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const { texts } = useLocale();
  return (
    <button className={buttonStyles.searchButton} onClick={onClick}>
      <span>{texts.button.search}</span>
    </button>
  );
}
