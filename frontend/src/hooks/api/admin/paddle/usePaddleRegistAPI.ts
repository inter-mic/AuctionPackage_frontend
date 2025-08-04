//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminPaddleRegistRequest } from "@/types/admin/paddle/management";
import { Errors } from "@/types/errors";

export const usePaddleRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseStatus, setResponseStatus] = useState<number>();
  const paddleRegistAPI = async (paddleData: TAdminPaddleRegistRequest, isUpdate: boolean) => {
    const endPoint = isUpdate ? `paddle/update` : "paddle/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      paddleData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseStatus(status);
    }
  };
  return { responseStatus, setResponseStatus, errors, paddleRegistAPI };
};
