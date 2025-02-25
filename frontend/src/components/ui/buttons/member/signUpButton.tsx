import { texts } from '@/config/texts';
import styles from '@/styles/Button.module.css';
interface SignupButtonProps {
    onClick?: () => void; 
    label: string;
  }
export function SignupButton({  onClick ,label}: SignupButtonProps) {
    return (
        <button  onClick={onClick} className={styles.signupButton}>
            <span >{ label }</span>
         </button>
    );
}