import { useCommonSetup } from "@/hooks/useCommonSetup";

interface CategoryBulkUpdateData {
  categorySeq: string;
  sortOrder: number;
  categoryName: string;
}

export const useCategoryBulkUpdateAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [bulkUpdateErrors, setBulkUpdateErrors] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const categoryBulkUpdateAPI = async (categories: CategoryBulkUpdateData[], isOya: boolean) => {
    setIsLoading(true);
    setBulkUpdateErrors(undefined);
    const endPoint = isOya ? "category/ikkatsuUpdate/oya" : "category/ikkatsuUpdate/child";
    try {
      const { status } = await apiRequest(
        "admin",
        endPoint,
        "POST",
        { categories },
        texts.message.regist,
        true
      );

      if (status === 200) {
        return { success: true };
      }
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categoryBulkUpdateAPI,
    bulkUpdateErrors,
    isLoading,
  };
};
