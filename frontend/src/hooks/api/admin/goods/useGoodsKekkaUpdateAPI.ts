//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { TGoodsKekkaData } from "@/types/admin/goods/register";

export const useGoodsKekkaUpdateAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [goodsKekkaRegistErrors, setGoodsKekkaRegistErrors] = useState<Errors>();

  const goodsKekkaUpdateAPI = async (goodsKekka: TGoodsKekkaData) => {
    const sanitizedKekkaData = {
      ...goodsKekka,
      rakusatsuPrice: goodsKekka.rakusatsuPrice
        ? goodsKekka.rakusatsuPrice.replace(/,/g, "")
        : null,
    };

    const { status, data: responseData } = await apiRequest(
      "admin",
      `goods/kekkaUpdate/${goodsKekka.goodsId}`,
      "POST",
      sanitizedKekkaData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setGoodsKekkaRegistErrors(responseData);
    } else if (status == 200) {
      window.location.href = `/admin/goods/register?goodsId=${goodsKekka.goodsId}`;
    }
  };
  return { goodsKekkaRegistErrors, goodsKekkaUpdateAPI };
};
