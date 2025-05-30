//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { TTtPageSetting } from "@/types/admin/pagesetting/search";

export const usePageSettingRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<TTtPageSetting>();
  const pageSettingRegistAPI = async (
    data: TTtPageSetting,
    file: File | null
  ) => {
    const formData = new FormData();
    // ファイルをformDataに追加
    if (file) {
      formData.append("files", file);
    }
    formData.append(
      "request",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    const { status, data: responseData } = await apiRequest(
      "admin",
      `pageSetting/update/${data.pageSeq}`,
      "POST",
      formData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    }
  };
  return { responseData, errors, pageSettingRegistAPI };
};
