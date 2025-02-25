//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import { TTopImage } from '@/types/common/MtTopImage';




export const useTopImageSearchAPI = (isLogin: boolean) => {
  const { useState, apiRequest,useEffect } = useCommonSetup();
  const [topImageList, setTopImageList] = useState<TTopImage[]>([]);
  useEffect(() => {
    const fetchTopImage = async () => {
      const endPointKbn = `${isLogin ? "member" : "public"}`;
      const { status, data: responseData } = await apiRequest(endPointKbn, "topImage/search", 'POST', null, "", true);
      if (status === 200) {
        setTopImageList(responseData);
      }
    };
    fetchTopImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return { topImageList }
};