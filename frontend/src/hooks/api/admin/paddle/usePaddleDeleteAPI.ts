//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const usePaddleDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseStatus, setResponseStatus] = useState<number>(); 
  const paddleDeleteAPI = async (auctionSeq:string, userId:string) => {
    const endPoint = `paddle/delete/${auctionSeq}/${userId}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, texts.message.delete, true);
    setResponseStatus(status);
  };
  return { responseStatus, errors, paddleDeleteAPI };
};
