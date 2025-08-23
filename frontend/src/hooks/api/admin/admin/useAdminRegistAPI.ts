//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useAdminRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState(null);
  const adminRegist = async (AdminData: any) => {
    const endPoint = `update/1`;
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      AdminData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
    }
  };
  return { responseData, errors, adminRegist };
};
