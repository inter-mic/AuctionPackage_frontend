import { useRouter } from "next/navigation";
//コンフィグ
import { texts } from "@/config/texts";
interface Props {
  auctionSeq?: number;
  className: string;
}

export function ToLiveApplicationButton({ auctionSeq, className }: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/member/live/application?auctionSeq=${auctionSeq}`);
  };
  return (
    <button onClick={handleClick} className={className}>
      <span>{texts.button.toLiveApplication}</span>
    </button>
  );
}
