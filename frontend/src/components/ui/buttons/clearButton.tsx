import React from 'react';
import { texts } from '@/config/texts';

interface ClearButtonProps {
    onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps) {
    return (
        <button
            type="button"
            onClick={onClear}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full w-40"
        >
            <span>{texts.button.clear}</span>
        </button>
    );
}
