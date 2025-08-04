import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useShoninOnOffAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const shoninOnOffAPI = async (userId: number, shoninFlg: boolean) => {
    const endPoint = `user/${shoninFlg ? "shoninOn" : "shoninOff"}/${userId}`;
    const message = `${shoninFlg ? texts.message.shoninRegist : texts.message.noShoninRegist}`;
    return await apiRequest("admin", endPoint, "POST", null, message, false);
  };
  return { shoninOnOffAPI };
};

export default useShoninOnOffAPI;
