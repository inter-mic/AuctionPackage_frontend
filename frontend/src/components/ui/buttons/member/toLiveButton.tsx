import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
//コンフィグ
import buttonStyles from "@/styles/Button.module.css";

/**
 * This component is a button that redirects to the live page when clicked.
 * It is intended to be used in the member menu.
 *
 * @param {Props} props
 */
export function ToLiveButton() {
  const router = useRouter();
  const { texts } = useLocale();
  const handleClick = () => {
    router.push(`/member/live/bid`);
  };
  return (
    <button className={buttonStyles.toLiveButton} onClick={handleClick}>
      <span>{texts.menu.memberJoinLive}</span>
    </button>
  );
}
