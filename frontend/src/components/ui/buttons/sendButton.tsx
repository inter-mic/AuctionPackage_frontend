import { useLocale } from "@/hooks/useLocale";
import styles from "@/styles/Button.module.css";
export function SendButton() {
  const { texts } = useLocale();
  return (
    <button className={styles.sendButton}>
      <span>{texts.button.send}</span>
    </button>
  );
}

export function SendConfirmButton() {
  const { texts } = useLocale();
  return (
    <button className={styles.sendButton}>
      <span>{texts.button.sendConfirm}</span>
    </button>
  );
}
