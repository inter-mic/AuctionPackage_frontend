import { useLocale } from "@/hooks/useLocale";
import styles from "@/styles/Button.module.css";
export function LoginButton() {
  const { texts } = useLocale();
  return (
    <button className={styles.loginButton}>
      <span>{texts.button.login}</span>
    </button>
  );
}
