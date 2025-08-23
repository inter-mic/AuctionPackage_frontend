//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TemplateResult } from "@/types/admin/mail/search";

export const useMailTemplateSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [templateData, setData] = useState<TemplateResult[]>([]);
  const mailTemplateSearch = async () => {
    const endPoint = "mailTemplate/search";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { templateData, mailTemplateSearch };
};
