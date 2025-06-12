import { useLocale } from "@/hooks/useLocale";
import styles from "@/styles/Button.module.css";
export function PasswordChangeButton() {
  const { texts } = useLocale();
  return (
    <button className={styles.passwordChangeButton}>
      <span>{texts.button.regist}</span>
    </button>
  );
}
