//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TVUserMember } from '@/types/common/user';


export const useUserSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [ userData, setUserData] = useState<TVUserMember>();

  const userSearchAPI   = async ()=>{
    const endPoint = `user/search`;
    const {  data: responseData } =await apiRequest("member", endPoint, 'POST', null, "", true);
    if (responseData) {
      setUserData(responseData);
    }

  };

  return { userData,userSearchAPI };
};
