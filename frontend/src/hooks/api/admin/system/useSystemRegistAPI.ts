//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useSystemRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [systemErrors, setErrors] = useState<Errors>();
  const [systemResponseData, setResponseData] = useState(null);
  const systemRegist = async (SystemData: any) => {
    const systemSeq = SystemData.systemSeq || "";
    const endPoint = systemSeq ? `system/update/${systemSeq}` : "system/insert";

    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      SystemData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
    }
  };

  return { systemResponseData, systemErrors, systemRegist };
};
