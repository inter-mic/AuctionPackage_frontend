//コンフィグ
import { texts } from '@/config/texts';

interface Props {
    onClick?: () => void; 
    status: number;
    disabled: boolean;
  }

  export function StatusButton({ onClick, status, disabled }: Props) {
    return (
        <button
        className={`bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
              {status === 1 ? (
                <span >{texts.button.BidComingSoon}</span>
            ) : (
                <span >{texts.button.BidFinush}</span>
            )}
        </button>
    );
}