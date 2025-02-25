//コンフィグ
import { texts } from '@/config/texts';
import buttonStyles from '@/styles/Button.module.css';
interface SearchButtonProps {
    onClick?: () => void; 
  }

  export function SearchButton({ onClick }: SearchButtonProps) {
    return (
        <button 
        className={buttonStyles.searchButton}
        onClick={onClick} >
            <span >{texts.button.search}</span>
        </button>
    );
}