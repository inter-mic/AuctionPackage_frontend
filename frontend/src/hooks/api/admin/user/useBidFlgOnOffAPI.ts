import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useBidFlgOnOffAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const bidFlgOnOffAPI = async (userId: number, teishiFlg: boolean) => {
    const endPoint = `user/${teishiFlg ? "bidFlgOn" : "bidFlgOff"}/${userId}`;
    return await apiRequest("admin", endPoint, "POST", null, texts.message.regist);
  };
  return { bidFlgOnOffAPI };
};
export default useBidFlgOnOffAPI;
