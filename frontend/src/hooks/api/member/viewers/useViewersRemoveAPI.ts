//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useViewersRemoveAPI = () => {
  const { apiRequest } = useCommonSetup();

  const removeViewersAPI = async (goodsId: number, sessionId: string) => {

    const params = {
      sessionId: sessionId,
    };

    const result = await apiRequest("member", `viewers/remove/${goodsId}`, "POST", params, "", true);

    return result.status === 200;
  };

  return { removeViewersAPI };
};
