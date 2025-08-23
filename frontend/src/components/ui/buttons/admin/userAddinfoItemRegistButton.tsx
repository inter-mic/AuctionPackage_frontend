import { useCallback } from "react";
//コンフィグ
import { texts } from "@/config/texts.ja";
//API
import useUserAddinfoItemRegistAPI from "@/hooks/api/admin/user/useUserAddinfoItemRegistAPI";

interface RegistButtonProps {
  seq: number;
  userAddinfo: string | null;
}
export const UserAddinfoItemRegistButton: React.FC<RegistButtonProps> = ({ seq, userAddinfo }) => {
  const { userAddinfoItemRegistAPI } = useUserAddinfoItemRegistAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const requestData = {
        userAddinfo: userAddinfo || "",
      };
      await userAddinfoItemRegistAPI(seq, requestData);
    },
    [userAddinfo, seq, userAddinfoItemRegistAPI]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500  hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg  w-20 sm:w-full"
    >
      <span>{texts.button.update}</span>
    </button>
  );
};
