//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useUserRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState(null);
  const userRegist = async (UserData: any) => {
    const endPoint = UserData.userId ? `user/update/${UserData.userId}` : "user/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      UserData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
    }
  };
  return { responseData, errors, userRegist };
};
