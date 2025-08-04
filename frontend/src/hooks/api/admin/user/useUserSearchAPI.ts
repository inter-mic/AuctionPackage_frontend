//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { SearchParams, TAdminUserSelect } from "@/types/admin/member/search";

export const useUserSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminUserSelect[]>([]);
  const userSearchAPI = async (searchParams: SearchParams) => {
    const endPoint = `user/search`;
    const { data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );
    if (responseData) {
      setData(responseData);
    }
  };
  return { data, userSearchAPI };
};
