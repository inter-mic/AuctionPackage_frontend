//コンフィグ
import { texts } from '@/config/texts';

interface Props {
    onClick?: () => void; 
    status: number;
    disabled: boolean;
  }

  export function ResultsButton({ onClick, status, disabled }: Props) {
    return (
        <button
        className={`bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full w-80 h-20 text-2xl text-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        disabled={disabled}
      >
              {status === 1 ? (
                <span >{texts.button.furakusatsu}</span>
            ) : (
                <span >{texts.button.rakusatsu}</span>
            )}
        </button>
    );
}