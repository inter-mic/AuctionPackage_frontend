//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import  { dataURLtoFile, urlToFile  }  from '@/components/ui/images/fileUtils';
//型定義
import { Errors } from '@/types/errors';
import { TopImageData } from '@/types/admin/topImage/register';

interface Image {
  imageSeq: string;
  isNewFlg: boolean;
  isDeleteFlg: boolean;
  topImageUrl: string;
  linkUrl: string;
}

export const useTopImageRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<TopImageData>();
  const topImageRegistAPI = async (images: Image[] | null) => {
    const formData = new FormData();
    if(images != null){
      images.forEach((image, index) => {
        if(image.isNewFlg){
          const file = dataURLtoFile(image.topImageUrl, `image_${index}.png`);
          formData.append(`files`, file);
        }else{
          formData.append('files', new Blob());
        }

        formData.append(`imageSeqList`, image.imageSeq);
        formData.append(`linkUrlList`, image.linkUrl);
        formData.append('isNewFlgList', image.isNewFlg ? "true" : "false");
        formData.append('isDeleteFlgList', image.isDeleteFlg ? "true" : "false");
      });
    }
    
    const endPoint = `topImage/update`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', formData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    }
  };

  return { responseData, errors, topImageRegistAPI };
};
