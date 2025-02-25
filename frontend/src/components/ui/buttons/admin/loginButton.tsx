import { texts } from '@/config/texts';
import styles from '@/styles/Button.module.css';
export function LoginButton() {
    return (
        <button className={styles.adminLoginButton}>
            <span >{ texts.button.login }</span>
         </button>
    );
}