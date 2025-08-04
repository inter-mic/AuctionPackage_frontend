import { useState, useEffect } from "react";

interface Props {
  initialTime: string;
  onEnd?: () => void; // カウントダウン終了時のコールバック（オプション）
}

const RemainingTimeComponent: React.FC<Props> = ({ initialTime }) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isEndingSoon, setIsEndingSoon] = useState(false);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout | null = null;
    // 文字列から秒数を取得する関数
    const parseRemainingTime = (timeStr: string): number => {
      let totalSeconds = 0;
      const dayMatch = timeStr.match(/(\d+)日/);
      const hourMatch = timeStr.match(/(\d+)時間/);
      const minuteMatch = timeStr.match(/(\d+)分/);
      const secondMatch = timeStr.match(/(\d+)秒/);

      if (dayMatch) totalSeconds += parseInt(dayMatch[1]) * 86400;
      if (hourMatch) totalSeconds += parseInt(hourMatch[1]) * 3600;
      if (minuteMatch) totalSeconds += parseInt(minuteMatch[1]) * 60;
      if (secondMatch) totalSeconds += parseInt(secondMatch[1]);
      return totalSeconds;
    };

    // 秒数をフォーマットする関数
    const formatRemainingTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
      }
      if (minutes > 0) {
        return secs > 0 ? `${minutes}分${secs}秒` : `${minutes}分`;
      }
      return `${secs}秒`;
    };

    if (initialTime === "終了" || initialTime === "開始前") {
      setRemainingTime(initialTime);
    } else {
      let secondsLeft = parseRemainingTime(initialTime);
      if (secondsLeft > 0) {
        if (secondsLeft <= 59) {
          // 59秒以下なら 1秒ごとに更新
          countdownTimer = setInterval(() => {
            secondsLeft -= 1;
            setRemainingTime(secondsLeft > 0 ? formatRemainingTime(secondsLeft) : "0秒");
            setIsEndingSoon(secondsLeft <= 10);
            if (secondsLeft <= 0 && countdownTimer) clearInterval(countdownTimer);
          }, 1000);
        } else {
          setRemainingTime(initialTime);
          setIsEndingSoon(false);
        }
      }
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [initialTime]);

  return <span>{isEndingSoon && initialTime !== "終了" ? "もうすぐ終了" : remainingTime}</span>;
};

export default RemainingTimeComponent;
