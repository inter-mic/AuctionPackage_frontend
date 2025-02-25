import {useCommonSetup} from '@/hooks/useCommonSetup';

export const useTeishiOnOffAPI = () => {
  const {  useState,useEffect,useCallback ,useRouter,texts,  apiRequest } = useCommonSetup();
  const teishiOnOffAPI  = async (userId: number, teishiFlg: boolean)=>{
    const endPoint = `staff/${teishiFlg ? "teishiOn" : "teishiOff"}/${userId}`;
    return  await apiRequest("admin", endPoint, 'POST', null, texts.message.regist);
  };
  return { teishiOnOffAPI };
};
  export default useTeishiOnOffAPI;