//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useGoodsKekkaDeleteAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [goodsKekkaRegistErrors, setGoodsKekkaRegistErrors] = useState<Errors>();
  const goodsKekkaDeleteAPI = async (goodsId: number) => {
    const { status, data: responseData } = await apiRequest(
      "admin",
      `goods/kekkaDelete/${goodsId}`,
      "POST",
      null,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setGoodsKekkaRegistErrors(responseData);
    } else if (status == 200) {
      window.location.href = `/admin/goods/register?goodsId=${goodsId}`;
    }
  };
  return { goodsKekkaRegistErrors, goodsKekkaDeleteAPI };
};
