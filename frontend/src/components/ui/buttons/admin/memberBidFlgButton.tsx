import { useCallback } from "react";
import { texts } from "@/config/texts.ja";
//API
import useBidFlgOnOffAPI from "@/hooks/api/admin/user/useBidFlgOnOffAPI";

interface Props {
  userId: number;
  onUpdate: (userId: number, shoninFlg: boolean) => void;
}

const MemberBidFlgOnButton: React.FC<Props> = ({ userId, onUpdate }) => {
  const { bidFlgOnOffAPI } = useBidFlgOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const success = await bidFlgOnOffAPI(userId, true);
      if (success) {
        onUpdate(userId, true);
      }
    },
    [userId, bidFlgOnOffAPI, onUpdate]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-yellow-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.bidOn}</span>
    </button>
  );
};

const MemberBidFlgOffButton: React.FC<Props> = ({ userId, onUpdate }) => {
  const { bidFlgOnOffAPI } = useBidFlgOnOffAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // イベントの伝播を停止
      const success = await bidFlgOnOffAPI(userId, false);
      if (success) {
        onUpdate(userId, false);
      }
    },
    [userId, bidFlgOnOffAPI, onUpdate]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.bidOff}</span>
    </button>
  );
};

export { MemberBidFlgOnButton, MemberBidFlgOffButton };
