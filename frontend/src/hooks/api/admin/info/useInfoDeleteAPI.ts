//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useInfoDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const infoDelete = async (fetchedData: any) => {
    const endPoint = `MtInfo/delete/${fetchedData.infoSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.delete,
      false
    );
    if (status == 200) {
      //window.location.reload();
    }
  };

  return { infoDelete };
};
