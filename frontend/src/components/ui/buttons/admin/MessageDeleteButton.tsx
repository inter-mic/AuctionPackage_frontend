import { useCallback } from "react";
//コンフィグ
import { texts } from "@/config/texts.ja";
//API
import useMessageDeleteAPI from "@/hooks/api/admin/live/message/useMessageDeleteAPI";

interface RegistButtonProps {
  messageSeq: string;
}
export const MessageDeleteButton: React.FC<RegistButtonProps> = ({ messageSeq }) => {
  const { messageDeleteAPI } = useMessageDeleteAPI();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // フォーム送信を防止
      e.stopPropagation(); // イベントの伝播を停止
      await messageDeleteAPI(messageSeq);
    },
    [messageSeq, messageDeleteAPI]
  );

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-opacity-50  text-white font-bold py-2 px-4 rounded-lg  w-full sm:w-40"
    >
      <span>{texts.button.delete}</span>
    </button>
  );
};
