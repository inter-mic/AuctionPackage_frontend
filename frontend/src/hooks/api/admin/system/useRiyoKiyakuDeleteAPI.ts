import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useRiyoKiyakuDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const riyoKiyakuDeleteAPI = async (systemSeq: any) => {
    const endPoint = `system/kiyaku/delete/${systemSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.delete,
      false
    );
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { riyoKiyakuDeleteAPI };
};

export default useRiyoKiyakuDeleteAPI;
