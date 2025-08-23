//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useZipCodeUploadRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [zipCodeUploadErrors, setErrors] = useState<Errors>();
  const zipCodeUploadRegistAPI = async (file: File | null) => {
    const endPoint = `system/zipCode/upload`;
    const formData = new FormData();
    if (file) {
      formData.append("files", file);
    }

    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      formData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    }
  };

  return { zipCodeUploadErrors, zipCodeUploadRegistAPI };
};
