//コンフィグ
import { texts } from '@/config/texts';

interface LiveBidButtonProps {
    onClick?: () => void; 
    disabled: boolean;
    text: string;
  }

  export function LiveBidButton({ onClick,  disabled, text}: LiveBidButtonProps) {
    return (
        <button
        className={`bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full w-80 h-20 text-2xl ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
             <span >\{text} {texts.live.bid}</span>
        </button>
    );
}