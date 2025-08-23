//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義

export const useAdminSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [adminData, setData] = useState(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const adminSearch = async () => {
    const endPoint = "search/1";
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData);
      if (responseData && responseData.length > 0) {
        const adminInfo = responseData[0];
        setCompanyName(adminInfo.companyName || " ");
      } else {
        setCompanyName(" ");
      }
    }
  };

  return { adminData, companyName, adminSearch };
};
