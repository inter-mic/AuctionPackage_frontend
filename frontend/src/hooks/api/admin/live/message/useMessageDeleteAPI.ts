import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useMessageDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();

  const messageDeleteAPI = async (messageSeq: any) => {
    const endPoint = `liveMessage/delete/${messageSeq}`;
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
  return { messageDeleteAPI };
};

export default useMessageDeleteAPI;
