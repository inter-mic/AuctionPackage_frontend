//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { GoodsData } from '@/types/admin/goods/register';
import { CsvUpdateData } from '@/types/admin/goods/csvUpdate';



export const useGoodsCsvTesuryoUploadAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [csvTesuryoUploadErrors, setErrors] = useState<Errors>();
  const [csvTesuryoUploadResponseData, setResponseData] = useState<GoodsData>();

  const goodsCsvTesuryoUpload = async (file: File | null) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const endPoint = `goodstesuryocsv/tesuryoupload`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', formData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  
  return { csvTesuryoUploadResponseData, csvTesuryoUploadErrors, goodsCsvTesuryoUpload };
};