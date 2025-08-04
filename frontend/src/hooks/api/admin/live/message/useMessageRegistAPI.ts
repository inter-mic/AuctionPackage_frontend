import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useMessageRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState(null);
  const messageRegistAPI = async (messageSeq: any, message: any) => {
    const endPoint = messageSeq ? `liveMessage/update/${messageSeq}` : "liveMessage/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      message,
      texts.message.regist,
      false
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 500) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
      if (!messageSeq) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };
  return { responseData, errors, messageRegistAPI };
};

export default useMessageRegistAPI;
