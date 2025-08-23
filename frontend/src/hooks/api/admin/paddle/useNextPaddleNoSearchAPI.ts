//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminNextPaddleSearchRequest } from "@/types/admin/paddle/management";
import { Errors } from "@/types/errors";
export const useNextPaddleNoSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [nextPaddleNo, setNextPaddleNo] = useState<string>();
  const nextPaddleNoSearchAPI = async (params: TAdminNextPaddleSearchRequest) => {
    const endPoint = `paddle/nextPaddleNo`;
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      params,
      "",
      true
    );
    if (responseData) {
      if (status == 400) {
        setErrors(responseData);
      } else if (status == 200) {
        setNextPaddleNo(responseData);
      }
    }
  };
  return { nextPaddleNo, errors, nextPaddleNoSearchAPI };
};
