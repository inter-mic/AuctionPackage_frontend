//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import styles from '@/styles/Button.module.css';
export function ToSignupButton() {
    const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
    const router = useRouter();
    const onClick = () => {
        router.push("./signup");
    };
    return (
        <button onClick={onClick} className={styles.signupButton}>
            <span >{ texts.button.newSignup }</span>
         </button>
    );
}