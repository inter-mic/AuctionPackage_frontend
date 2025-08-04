import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useFaviconImageDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const faviconImageDeleteAPI = async (systemSeq: any) => {
    const endPoint = `system/faviconImage/delete/${systemSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.regist,
      false
    );
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { faviconImageDeleteAPI };
};

export default useFaviconImageDeleteAPI;
