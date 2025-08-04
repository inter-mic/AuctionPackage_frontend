//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminPaddleSearchRequest } from "@/types/admin/paddle/management";

export const usePaddleSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const paddleSearchCountAPI = async (searchParams: TAdminPaddleSearchRequest) => {
    const endPoint = `paddle/count`;
    const { data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );
    if (responseData) {
      setCount(responseData);
    }
  };
  return { count, paddleSearchCountAPI };
};
