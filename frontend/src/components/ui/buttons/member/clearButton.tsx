import React from 'react';
import { texts } from '@/config/texts';
import buttonStyles from '@/styles/Button.module.css';
interface ClearButtonProps {
    onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps) {
    return (
        <button
            type="button"
            onClick={onClear} 
            className={buttonStyles.clearButton}
        >
            <span>{texts.button.clear}</span>
        </button>
    );
}
