import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useApiRequest } from "@/hooks/api/useApiRequestProgress";
import { AxiosProgressEvent } from "axios";

// 型定義
import { Errors } from "@/types/errors";
import { ZipUpdateData } from "@/types/admin/goods/zipUpdate";

export const useGoodsZipUploadAPI = () => {
  const { useState, texts } = useCommonSetup();
  const { apiRequest } = useApiRequest();
  const [zipUploadErrors, setErrors] = useState<Errors>();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const goodsZipUpload = async (zipUpdateData: ZipUpdateData, file: File | null) => {
    setLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("images", file);
    }
    formData.append(
      "zipUploadData",
      new Blob([JSON.stringify(zipUpdateData)], { type: "application/json" })
    );
    const endPoint = "goodszip/upload";
    const { status, data: responseData } = (await apiRequest(
      "admin",
      endPoint,
      "POST",
      formData,
      texts.message.regist,
      true,
      {},
      {
        onUploadProgress: (event: AxiosProgressEvent) => {
          // ✅ `AxiosProgressEvent` を使用
          if (event.total) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            setProgress(percentCompleted); // CircularProgressWithLabel を更新
          }
        },
      }
    )) || { status: 500, data: null };

    setLoading(false);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return { zipUploadErrors, goodsZipUpload, loading, progress };
};
