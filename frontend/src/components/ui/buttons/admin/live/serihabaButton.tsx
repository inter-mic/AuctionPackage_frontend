import { texts } from '@/config/texts';
import { formatPriceDivision,formatPriceMultiplication,formatPriceWithCommas } from '@/components/common/PriceUtils';
interface SerihabaButtonProps {
    isplus: boolean;
    disabled: boolean;
    currentPrice: string;
    nextPrice: string;
    fetchGoodsData: { bidUnit: string | null }; 
    onUpdatePrices: (current: string, next: string) => void; 
  }
  
  export function SerihabaButton({
    isplus,
    disabled,
    currentPrice,
    nextPrice,
    fetchGoodsData,
    onUpdatePrices,
  }: SerihabaButtonProps) {
    const handleClick = () => {
      const bidUnit = Number(fetchGoodsData?.bidUnit?.replace(/,/g, '') || '0');
  
      // 現在価格の計算
      const current = formatPriceMultiplication(currentPrice);
      const newCurrentPrice = isplus ? current + bidUnit : current - bidUnit;
  
      // 次価格の計算
      const next = formatPriceMultiplication(nextPrice);
      const newNextPrice = isplus ? next + bidUnit : next - bidUnit;
  
      // 親コンポーネントに新しい値を渡す
      onUpdatePrices(formatPriceDivision(newCurrentPrice.toString()), formatPriceDivision(newNextPrice.toString()));
    };
  
    return (
      <button
        className={`bg-yellow-500 hover:bg-yellow-700 py-2 px-4 rounded-full w-40 text-xl ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        {isplus ? <span>{texts.button.plusSerihaba}</span> : <span>{texts.button.minusSerihaba}</span>}
      </button>
    );
  }