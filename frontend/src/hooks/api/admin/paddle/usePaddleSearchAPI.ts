//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminPaddleSearchRequest, TAdminPaddleSelect } from "@/types/admin/paddle/management";
import { Errors } from "@/types/errors";
export const usePaddleSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [data, setData] = useState<TAdminPaddleSelect[]>([]);
  const paddleSearchAPI = async (searchParams: TAdminPaddleSearchRequest) => {
    const endPoint = `paddle/search`;
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );
    if (responseData) {
      if (status == 400) {
        setErrors(responseData);
      } else if (status == 200) {
        setData(responseData);
      }
    }
  };
  return { data, errors, paddleSearchAPI };
};
