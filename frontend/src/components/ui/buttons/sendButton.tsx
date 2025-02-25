import { texts } from '@/config/texts';
import styles from '@/styles/Button.module.css';
export function SendButton() {
    return (
        <button className={styles.sendButton}>
            <span >{ texts.button.send }</span>
         </button>
    );
}

export function SendConfirmButton() {
    return (
        <button className={styles.sendButton}>
            <span >{ texts.button.sendConfirm }</span>
         </button>
    );
}