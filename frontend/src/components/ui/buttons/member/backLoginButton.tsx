//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
export function BackLoginButton() {
  const { useRouter, texts } = useCommonSetup();
  const router = useRouter();
  const onClick = () => {
    router.push("./login");
  };
  return (
    <button
      onClick={onClick}
      className="w-1/2 my-5 bg-gray-800 hover:bg-black text-white font-bold p-4 rounded"
    >
      <span>{texts.button.backLogin}</span>
    </button>
  );
}
