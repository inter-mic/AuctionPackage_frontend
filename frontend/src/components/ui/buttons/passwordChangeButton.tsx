import { texts } from '@/config/texts';
import styles from '@/styles/Button.module.css';
export function PasswordChangeButton() {
    return (
        <button className={styles.passwordChangeButton}>
            <span >{ texts.button.regist }</span>
         </button>
    );
}

