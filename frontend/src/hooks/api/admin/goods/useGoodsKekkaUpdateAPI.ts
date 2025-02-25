//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import  { dataURLtoFile, urlToFile  }  from '@/components/ui/images/fileUtils';
//型定義
import { Errors } from '@/types/errors';
import { GoodsKekkaData } from '@/types/admin/goods/register';

interface Image {
  no: string;
  isNewFlg: boolean;
  thumbnailImageUrl: string;
  originalImageUrl: string;
}

export const useGoodsKekkaUpdateAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [goodsKekkaRegistErrors, setGoodsKekkaRegistErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<GoodsKekkaData>();
  const router = useRouter();
  const goodsKekkaUpdateAPI = async (goodsKekka: GoodsKekkaData) => {
    const sanitizedKekkaData = {
      ...goodsKekka,
      rakusatsuPrice: goodsKekka.rakusatsuPrice ? goodsKekka.rakusatsuPrice.replace(/,/g, '') : null,
    };

    const { status, data: responseData } = await apiRequest("admin", `goods/kekkaUpdate/${goodsKekka.goodsId}`, 'POST', sanitizedKekkaData, texts.message.regist, true);
    if (status == 400) {
      setGoodsKekkaRegistErrors(responseData);
    } else if (status == 200) {
      window.location.href = `/admin/goods/register?goodsId=${goodsKekka.goodsId}`;
    }
  };
  return { responseData, goodsKekkaRegistErrors, goodsKekkaUpdateAPI };
};
