//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { GoodsData } from '@/types/admin/goods/register';
import { CsvUpdateData } from '@/types/admin/goods/csvUpdate';



export const useGoodsCsvUploadAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [csvUploadErrors, setErrors] = useState<Errors>();
  const [csvUploadResponseData, setResponseData] = useState<GoodsData>();

  const goodsCsvUpload = async (csvUpdateData: CsvUpdateData, file: File | null) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const endPoint = `goodscsv/upload/${csvUpdateData.auctionSeq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', formData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  
  return { csvUploadResponseData, csvUploadErrors, goodsCsvUpload };
};