//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { UserAddinfoItem } from "@/types/public/userAddinfoItem";

export const useUserAddinfoItemAPI = () => {
  const { useState, useEffect } = useCommonSetup();
  const [userAddinfo, setUserAddInfo] = useState<UserAddinfoItem[]>([]);
  useEffect(() => {
    const userAddinfoItemAPI = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}userAddinfoItem/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data: UserAddinfoItem[] = await res.json();
        setUserAddInfo(data);
      } catch (error) {
        // エラーハンドリングは不要（または別で処理）
      } finally {
        // 後処理なし
      }
    };

    userAddinfoItemAPI();
  }, []);
  return { userAddinfo };
};
