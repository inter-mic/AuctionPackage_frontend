//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import {
  TGoodsData,
  initialGoodsData,
  TGoodsKekkaData,
  initialGoodsKekkaData,
} from "@/types/admin/goods/register";
import { Errors } from "@/types/errors";

export const useGoodsSearchByGoodsIdAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [goodsSearchErrors, setGoodsSearchErrors] = useState<Errors>();
  const [fetchGoodsData, setFetchGoodsData] = useState<TGoodsData>(initialGoodsData);
  const [fetchGoodsKekkaData, setFetchGoodsKekkaData] =
    useState<TGoodsKekkaData>(initialGoodsKekkaData);
  const goodsSearchByGoodsIdAPI = async (
    flg: boolean,
    goodsId: number,
    auctionSeq: string,
    lot: string
  ) => {
    let endPoint = "";
    let requestBody = {};
    if (flg) {
      endPoint = `goods/findGoodsById/${goodsId}`;
      requestBody = { auctionSeq, lot };
    } else {
      endPoint = `goods/findGoodsByAuctionSeqAndLot`;
      requestBody = { auctionSeq, lot };
    }
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      requestBody,
      "",
      true
    );
    if (status == 400) {
      setGoodsSearchErrors(responseData);
    } else if (status == 200 && responseData) {
      setFetchGoodsData(responseData[0]);
      setFetchGoodsKekkaData(responseData[0]);
    }
  };

  return { fetchGoodsData, fetchGoodsKekkaData, goodsSearchErrors, goodsSearchByGoodsIdAPI };
};
