import { texts } from '@/config/texts';
import styles from '@/styles/Button.module.css';
export function LoginButton() {
    return (
        <button className={styles.loginButton}>
            <span >{ texts.button.login }</span>
         </button>
    );
}