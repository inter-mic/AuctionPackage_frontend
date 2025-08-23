import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

interface SideMenuLogoutButtonProps {
  isAdmin: boolean;
}
export function SideMenuLogoutButton({ isAdmin }: SideMenuLogoutButtonProps) {
  const router = useRouter();
  const { texts } = useLocale();
  const handleClick = () => {
    if (isAdmin) {
      router.push(`/admin/login`);
    } else {
      router.push(`/login`);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="bg-white text-gray-400 border border-solid border-gray-300 
        hover:bg-gray-300 hover:text-white
        py-4 px-4 mx-4 my-4 w-60"
    >
      <span>{texts.button.logout}</span>
    </button>
  );
}
