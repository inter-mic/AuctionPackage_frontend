//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
export const useUserGetInfoAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const userGetInfo = async (userId: string) => {
    const endPoint = `user/getInfo/${userId}`;
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData);
      if (responseData && responseData.length > 0) {
        const userInfo = responseData[0];
        setUserName(userInfo.userName || " ");
        setCompanyName(userInfo.companyName || " ");
      } else {
        setUserName(" ");
        setCompanyName(" ");
      }
    }
  };

  return { data, userName, companyName, userGetInfo };
};
