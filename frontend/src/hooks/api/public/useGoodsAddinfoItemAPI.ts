//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import { GoodsAddinfoItem } from '@/types/public/goodsAddinfoItem';



export const useGoodsAddinfoItemAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [goodsAddInfo, setGoodsAddInfo] = useState<GoodsAddinfoItem[]>([]);
  useEffect(() => {
    const goodsAddinfoItemAPI = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}goodsAddinfoItem/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          
        });
        const data:GoodsAddinfoItem[] = await res.json();
        setGoodsAddInfo(data);
      } catch (error) {
        
      } finally {
       
      }
    };

    goodsAddinfoItemAPI();
  }, []);
  return { goodsAddInfo};
};