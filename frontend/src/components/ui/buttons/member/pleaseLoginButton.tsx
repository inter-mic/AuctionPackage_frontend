import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
export function PleaseLoginButton() {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/login`);
  };
  const { texts } = useLocale();
  return (
    <button
      onClick={handleClick}
      className="bg-white text-gray-400 border border-solid border-gray-300 
        hover:bg-gray-300 hover:text-white
        py-4   my-4 w-full"
    >
      <span>{texts.button.login}</span>
    </button>
  );
}
