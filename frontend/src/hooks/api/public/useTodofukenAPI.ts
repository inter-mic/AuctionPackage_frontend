import { useEffect, useState } from "react";
//型定義
import { Todofuken } from "@/types/public/todofuken";

export const useTodofukenAPI = () => {
  const [todofuken, setTodofuken] = useState<Todofuken[]>([]);
  useEffect(() => {
    const fetchTodofuken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}todofuken/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data: Todofuken[] = await res.json();
        setTodofuken(data);
      } catch (error) {
        // エラーハンドリングは不要（または別で処理）
      } finally {
        // 後処理なし
      }
    };

    fetchTodofuken();
  }, []);
  return { todofuken };
};
