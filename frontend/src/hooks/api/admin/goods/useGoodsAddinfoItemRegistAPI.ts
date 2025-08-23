import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useGoodsAddinfoItemRegistAPI = () => {
  const { texts, apiRequest } = useCommonSetup();

  const goodsAddinfoItemRegistAPI = async (seq: any, GoodsAddinfo: any) => {
    const endPoint = `goodsAddinfoItem/update/${seq}`;
    await apiRequest("admin", endPoint, "POST", GoodsAddinfo, texts.message.regist, false);
  };
  return { goodsAddinfoItemRegistAPI };
};

export default useGoodsAddinfoItemRegistAPI;
