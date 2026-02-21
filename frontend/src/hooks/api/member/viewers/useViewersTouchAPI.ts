//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
type TViewersTouchResponse = {
  goodsId: number;
  count: number;
}[];

export const useViewersTouchAPI = () => {
  const { apiRequest } = useCommonSetup();

  const touchViewersAPI = async (goodsId: number, sessionId: string) => {

    const params = {
      sessionId: sessionId,
    };

    const result = await apiRequest("member", `viewers/touch/${goodsId}`, "POST", params, "", true);

    if (result.status === 200 && result.data) {
      return result.data as TViewersTouchResponse;
    }
    return null;
  };

  return { touchViewersAPI };
};
