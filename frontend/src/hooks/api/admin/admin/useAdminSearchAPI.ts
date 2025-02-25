//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Result } from '@/types/admin/admin/search';



export const useAdminSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [adminData, setData] = useState(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const adminSearch = async () => {
    const endPoint = 'search/1';
    const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
    if (responseData) {
      setData(responseData);
      if (responseData && responseData.length > 0) {
        const adminInfo = responseData[0];
        setCompanyName(adminInfo.companyName || ' '); 
      } else {
        setCompanyName(' ');
      }
    }
  };

  return { adminData, companyName, adminSearch }
};
