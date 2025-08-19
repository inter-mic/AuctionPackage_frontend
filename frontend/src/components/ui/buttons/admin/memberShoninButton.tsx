import { useCallback } from "react";
import { texts } from "@/config/texts.ja";
//API
import useShoninOnOffAPI from "@/hooks/api/admin/user/useShoninOnOffAPI";

interface ShoninButtonProps {
  userId: number;
  onUpdate: (userId: number, shoninFlg: boolean) => void;
}

const MemberShoninOnButton: React.FC<ShoninButtonProps> = ({ userId, onUpdate }) => {
  const { shoninOnOffAPI } = useShoninOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const success = await shoninOnOffAPI(userId, true);
      if (success) {
        onUpdate(userId, true);
      }
    },
    [userId, shoninOnOffAPI, onUpdate]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.shoninOn}</span>
    </button>
  );
};

const MemberShoninOffButton: React.FC<ShoninButtonProps> = ({ userId, onUpdate }) => {
  const { shoninOnOffAPI } = useShoninOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const success = await shoninOnOffAPI(userId, false);
      if (success) {
        onUpdate(userId, false);
      }
    },
    [userId, shoninOnOffAPI, onUpdate]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.shoninOff}</span>
    </button>
  );
};

export { MemberShoninOnButton, MemberShoninOffButton };
