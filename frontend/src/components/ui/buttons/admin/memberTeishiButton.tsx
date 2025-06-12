import { texts } from "@/config/texts.ja";
import { useCallback } from "react";
import useTeishiOnOffAPI from "@/hooks/api/admin/user/useTeishiOnOffAPI";

interface MemberTeishiButtonProps {
  userId: number;
  onUpdate: (userId: number, teishiFlg: boolean) => void;
}
const MemberTeishiOnButton: React.FC<MemberTeishiButtonProps> = ({ userId, onUpdate }) => {
  const { teishiOnOffAPI } = useTeishiOnOffAPI();

  const handleClick = useCallback(async () => {
    const success = await teishiOnOffAPI(userId, true);
    if (success) {
      onUpdate(userId, true);
    }
  }, [userId, teishiOnOffAPI, onUpdate]);

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.teishiOn}</span>
    </button>
  );
};

const MemberTeishiOffButton: React.FC<MemberTeishiButtonProps> = ({ userId, onUpdate }) => {
  const { teishiOnOffAPI } = useTeishiOnOffAPI();

  const handleClick = useCallback(async () => {
    const success = await teishiOnOffAPI(userId, false);
    if (success) {
      onUpdate(userId, false);
    }
  }, [userId, teishiOnOffAPI, onUpdate]);

  return (
    <button
      onClick={handleClick}
      className="bg-gray-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.teishiOff}</span>
    </button>
  );
};

export { MemberTeishiOnButton, MemberTeishiOffButton };
