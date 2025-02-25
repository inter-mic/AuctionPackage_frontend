import {useCommonSetup} from '@/hooks/useCommonSetup';

export const useFavoriteOnOffAPI = () => {
  const {  useState,useEffect,useCallback ,useRouter,texts,  apiRequest } = useCommonSetup();
  const favoriteOnOffAPI  = async (goodsId: number, favoriteFlg: boolean)=>{
    const endPoint = `favorite/${favoriteFlg ? "on" : "off"}/${goodsId}`;
    return await apiRequest("member", endPoint, 'POST', null, "", false);
  };
  return { favoriteOnOffAPI };
};
  
export default useFavoriteOnOffAPI;