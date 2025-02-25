//コンフィグ
import { texts } from '@/config/texts';

interface priceButtonProps {
    onClick?: () => void; 
    isonline: boolean;
    disabled: boolean;
  }

  export function PriceButton({ onClick, isonline, disabled }: priceButtonProps) {
    return (
        <button
        className={`bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-full w-80 h-20 text-2xl ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
              {isonline ? (
                <span >{texts.button.onlinePrice}</span>
            ) : (
                <span >{texts.button.currentPrice}</span>
            )}
        </button>
    );
}