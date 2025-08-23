//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

import { TopImageData } from "@/types/admin/topImage/register";

export const useTopImageSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [topImages, setTopImages] = useState<TopImageData[]>([]);
  const topImageSearch = async () => {
    const endPoint = `topImage/search`;
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      "",
      true
    );

    if (status == 200 && responseData) {
      setTopImages(responseData);
    }
  };

  return { topImages, topImageSearch };
};
