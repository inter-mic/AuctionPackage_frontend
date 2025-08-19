//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminUserSearchRequest, TAdminUserSelect } from "@/types/admin/member/search";

export const useUserSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminUserSelect[]>([]);
  const userSearchAPI = async (searchParams: TAdminUserSearchRequest) => {
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
