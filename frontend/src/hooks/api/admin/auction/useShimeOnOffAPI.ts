import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useShimeOnOffAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const shimeOnOffAPI = async (auctionSeq: number, shimeFlg: boolean) => {
    const endPoint = `auction/${shimeFlg ? "shimeOn" : "shimeOff"}/${auctionSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.regist,
      false
    );
    if (status == 200) {
      window.location.reload();
    }
  };
  return { shimeOnOffAPI };
};

export default useShimeOnOffAPI;
