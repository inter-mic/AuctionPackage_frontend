//コンフィグ
import { texts } from "@/config/texts.ja";
import { useEffect } from "react";
import { LiveBidKekkaData } from "@/types/admin/live/register";

interface Props {
  status: number;
  disabled: boolean;
  liveBidkekkaData?: any;
  liveBidLog?: any;
  connectionCount?: number;
  kenriUserId?: string | null;
  isRakusatsuProcessFlg?: boolean;
  sendWebSocketMessage: (type: string, payload?: any) => void;
  liveBidKekkaUpdateAPI?: (data: any, log: any, count: number) => Promise<boolean>;
  onNextLot?: () => void;
  setLiveBidkekkaData: React.Dispatch<React.SetStateAction<LiveBidKekkaData>>;
  onFocus?: () => void;
}

export function StatusButton({
  status,
  disabled,
  liveBidkekkaData,
  liveBidLog,
  connectionCount,
  kenriUserId,
  isRakusatsuProcessFlg,
  sendWebSocketMessage,
  liveBidKekkaUpdateAPI,
  onNextLot,
  setLiveBidkekkaData,
  onFocus,
}: Props) {
  let buttonText = "";
  if (status === 1) {
    buttonText = texts.button.BidComingSoon + "(F7)";
  } else if (status === 2) {
    buttonText = texts.button.rakusatsuProcess;
  } else if (status === 3) {
    buttonText = texts.button.bidRestart;
  }
  const bidComingSoonHaishin = () => {
    sendWebSocketMessage("bidComingSoon");
  };

  const rakusatusuProcess = () => {
    sendWebSocketMessage("rakusatsuProcessing");
  };

  const bidRestart = () => {
    sendWebSocketMessage("bidRestart");
  };

  const handleClick = () => {
    if (status === 1) {
      bidComingSoonHaishin();
    } else if (status === 2) {
      rakusatusuProcess();
      if (liveBidLog[0]?.paddleNo) {
        const paddleNo = liveBidLog[0].paddleNo;
        setLiveBidkekkaData((prev) => ({
          ...prev,
          rakusatsuPaddleNo: paddleNo,
        }));
      }
      // 落札処理ボタンクリック時にフォーカス
      if (onFocus) {
        onFocus();
      }
    } else if (status === 3) {
      bidRestart();
      // 入札再開ボタンクリック時にフォーカス
      if (onFocus) {
        onFocus();
      }
    }
  };

  // F7 / F8 shortcut handler
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "F7" && status === 1) {
        e.preventDefault();
        bidComingSoonHaishin();
      }
      if (e.key === "F8") {
        if (status === 2) {
          rakusatusuProcess();
          // 落札処理ボタン（F8）の場合、フォーカス
          if (onFocus) {
            onFocus();
          }
        } else if (status === 3) {
          bidRestart();
          // 入札再開ボタン（F8）の場合、フォーカス
          if (onFocus) {
            onFocus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, disabled]);

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full w-80 h-16 text-2xl text-white ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span>{buttonText}</span>
    </button>
  );
}
