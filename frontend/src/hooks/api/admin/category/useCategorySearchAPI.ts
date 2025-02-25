//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TCategorySearch } from '@/types/common/category/search';



export const useCategorySearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [category, setCategory] = useState<TCategorySearch[]>([]);
  useEffect(() => {
    const categorySearch = async (categorySeq: number) => {

      const endPoint = `category/search/${categorySeq}`;
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        setCategory(responseData);
      }
    };

    categorySearch(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { category };
};
