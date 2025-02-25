import { useRouter } from 'next/navigation';
//コンフィグ
import { texts } from '@/config/texts';
//スタイル
import buttonStyles from '@/styles/Button.module.css';
interface ToGoodsListButtonProps {
    auctionSeq?: number;
    isLogin:boolean;
}


export function ToGoodsListButton({ auctionSeq,isLogin }: ToGoodsListButtonProps) {

    const router = useRouter();
    const handleClick = () => {
        if(isLogin){
            router.push(`/member/goods/search?auctionSeq=${auctionSeq}`);
        }else{
            router.push(`/goods/search?auctionSeq=${auctionSeq}`);
        }
        
    };
    return (
        <button
            onClick={handleClick}
            className={buttonStyles.toGoodsListButton}>
            <span >{texts.button.toGoodsList}</span>
        </button>
    );
}