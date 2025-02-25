//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { auctionData } from '@/types/admin/auction/register';


export const useAuctionRegistAPI = () => {
  const { useState,  texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<auctionData>();
  const auctionRegist = async (auctionData: auctionData,  imageFile: File | null,  listFile: File | null) => {
    const formData = new FormData();
    // ファイルをformDataに追加
    if (imageFile) {
      formData.append('auctionImage', imageFile);
    }
    if (listFile) {
      formData.append('listImage', listFile);
    }
    formData.append('request', new Blob([JSON.stringify(auctionData)], {type : 'application/json'}))
    const endPoint = auctionData.auctionSeq
      ? `auction/update/${auctionData.auctionSeq}`
      : 'auction/insert';
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', formData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      window.location.reload();
    }
  };
  return { responseData, errors, auctionRegist };
};
