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

export const useGoodsKekkaDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [goodsKekkaRegistErrors, setGoodsKekkaRegistErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<GoodsKekkaData>();
  const router = useRouter();
  const goodsKekkaDeleteAPI = async (goodsId: number) => {

    const { status, data: responseData } = await apiRequest("admin", `goods/kekkaDelete/${goodsId}`, 'POST', null, texts.message.regist, true);
    if (status == 400) {
      setGoodsKekkaRegistErrors(responseData);
    } else if (status == 200) {
      window.location.href = `/admin/goods/register?goodsId=${goodsId}`;
    }
  };
  return { responseData, goodsKekkaRegistErrors, goodsKekkaDeleteAPI };
};
