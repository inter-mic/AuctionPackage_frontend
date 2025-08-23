import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useCategoryDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();

  const categoryDelete = async (categorySeq: any) => {
    const endPoint = `category/delete/${categorySeq}`;
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
  return { categoryDelete };
};

export default useCategoryDeleteAPI;
