import { useEffect, useState } from "react";
//型定義
import { TMtPaddleNumber } from "@/types/public/paddleNumber";

export const usePaddleNumberSearchAPI = () => {
  const [paddleKbnList, setPaddleKbnList] = useState<TMtPaddleNumber[]>([]);
  useEffect(() => {
    const paddleNumberSearchAPI = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}paddleNumber/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data: TMtPaddleNumber[] = await res.json();
        setPaddleKbnList(data);
      } catch {
        //  エラーハンドリングは不要
      } finally {
        // 後処理なし
      }
    };
    paddleNumberSearchAPI();
  }, []);
  return { paddleKbnList };
};
