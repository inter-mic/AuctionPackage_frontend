import { useLocale } from "@/hooks/useLocale";
import buttonStyles from "@/styles/Button.module.css";
interface Props {
  onClick: () => void;
}

export function ToLiveApplicationButton({ onClick }: Props) {
  const { texts } = useLocale();
  return (
    <button onClick={onClick} className={buttonStyles.calendarButton}>
      <span>{texts.button.liveApplication}</span>
    </button>
  );
}
