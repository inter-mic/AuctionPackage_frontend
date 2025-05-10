import { useRouter } from 'next/navigation';
//コンフィグ
import { texts } from '@/config/texts';
//スタイル
import buttonStyles from '@/styles/Button.module.css';
interface Props {
    auctionSeq?: number;
}


export function ToLiveApplicationButton({ auctionSeq }: Props) {

    const router = useRouter();
    const handleClick = () => {
       router.push(`/member/live/application?auctionSeq=${auctionSeq}`);
        
    };
    return (
        <button
            onClick={handleClick}
            className={buttonStyles.toGoodsListButton}>
            <span >{texts.button.toLiveApplication}</span>
        </button>
    );
}