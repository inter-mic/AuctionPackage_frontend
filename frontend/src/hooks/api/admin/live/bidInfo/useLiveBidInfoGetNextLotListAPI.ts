//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminGoodsSelect } from "@/types/admin/goods/search";
import { Errors } from "@/types/errors";

export const useLiveBidInfoGetNextLotListAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [liveBidInfoGetNextLotListErrors, setLiveBidInfoGetNextLotListErrors] = useState<Errors>();
  const [fetchLiveBidNextLotListData, setFetchLiveBidNextLotListData] = useState<
    TAdminGoodsSelect[]
  >([]);

  const liveBidInfoGetNextLotListAPI = async (
    flg: boolean,
    goodsId: number,
    auctionSeq: string
  ) => {
    let endPoint = "";
    let requestBody = {};
    if (flg) {
      endPoint = `liveBidInfo/getNextLotListById/${goodsId}`;
    } else {
      endPoint = `liveBidInfo/getNextLotList`;
      requestBody = { auctionSeq };
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
      setLiveBidInfoGetNextLotListErrors(responseData);
    } else if (status == 200 && responseData) {
      setFetchLiveBidNextLotListData(responseData);
    }
  };

  return {
    fetchLiveBidNextLotListData,
    liveBidInfoGetNextLotListErrors,
    liveBidInfoGetNextLotListAPI,
  };
};
