//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { infoData } from "@/types/admin/info/register";

export const useInfoRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();

  const infoRegist = async (infoData: infoData) => {
    const endPoint = infoData.infoSeq ? `MtInfo/update/${infoData.infoSeq}` : "MtInfo/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      infoData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      window.location.reload();
    }
  };
  return { errors, infoRegist };
};
