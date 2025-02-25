import { Dayjs } from 'dayjs';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import {  TTorihikiJissekiMeisaiRakusatsuSelect, TTorihikiJissekiMeisaiShuppinSelect } from '@/types/admin/torihikiJisseki/search';
import { Errors } from '@/types/errors';

export const useTorihikiJissekiMeisaiDateUpdateAPI = () => {  
 const { useState, texts, apiRequest } = useCommonSetup();
 const [errors, setErrors] = useState<Errors>();
 const [rakusatsuResponseData, setRakusatsuResponseData] = useState<TTorihikiJissekiMeisaiRakusatsuSelect[]>([]);
 const [shuppinResponseData, setShuppinResponseData] = useState<TTorihikiJissekiMeisaiShuppinSelect[]>([]);
  const torihikiJissekiMeisaiDateUpdateAPI  = async (selectedGoodsIds: number[]
    , date:string | null
    , updateKbn: string
    , paramsAuctionSeq: string | null
    , paramsUserId: string | null)=>{
   
    const params = {
      goodsIds: selectedGoodsIds,
      updateKbn: updateKbn,
      date: date,
      auctionSeq: paramsAuctionSeq,
      userId: paramsUserId,
  };
  var endPoint = "" ;
    if(updateKbn == "1" || updateKbn == "2"){
      endPoint = `torihikiJissekiMeisai/dateUpdate/rakusatsu`;
    }else{
      endPoint = `torihikiJissekiMeisai/dateUpdate/shuppin`;
    }
    const {  status, data: responseData } = await apiRequest("admin", endPoint, 'POST', params, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      if(updateKbn == "1" || updateKbn == "2"){
        setRakusatsuResponseData(responseData);
      }else{
        setShuppinResponseData(responseData);
      }
      
    }
  };
  
  return { torihikiJissekiMeisaiDateUpdateAPI, rakusatsuResponseData, shuppinResponseData, errors };
};