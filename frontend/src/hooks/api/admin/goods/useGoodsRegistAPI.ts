//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { dataURLtoFile } from "@/components/ui/images/fileUtils";
//型定義
import { Errors } from "@/types/errors";
import {
  TGoodsData,
  initialGoodsData,
  TGoodsKekkaData,
  initialGoodsKekkaData,
} from "@/types/admin/goods/register";

interface Image {
  no: string;
  isNewFlg: boolean;
  thumbnailImageUrl: string;
  originalImageUrl: string;
}

export const useGoodsRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [goodsRegistErrors, setGoodsRegistErrors] = useState<Errors>();
  const [responseGoodsData, setResponseGoodsData] = useState<TGoodsData>(initialGoodsData);
  const [responseGoodsKekkaData, setResponseGoodsKekkaData] =
    useState<TGoodsKekkaData>(initialGoodsKekkaData);

  const goodsRegistAPI = async (goodsData: TGoodsData, images: Image[] | null) => {
    const formData = new FormData();
    const sanitizedGoodsData = {
      ...goodsData,
      startPrice: goodsData.startPrice ? goodsData.startPrice.replace(/,/g, "") : null,
      saiteiRakusatsuPrice: goodsData.saiteiRakusatsuPrice
        ? goodsData.saiteiRakusatsuPrice.replace(/,/g, "")
        : null,
      
    };
    if (images != null) {
      images.forEach((image, index) => {
        if (image.isNewFlg) {
          const file = dataURLtoFile(image.originalImageUrl, `image_${index}.png`);
          formData.append(`files`, file);
        } else {
          formData.append("files", new Blob());
        }

        formData.append("goodsImagesNoList", image.no);
        formData.append("isNewFlgList", image.isNewFlg ? "true" : "false");
      });
    }

    formData.append(
      "goodsData",
      new Blob([JSON.stringify(sanitizedGoodsData)], { type: "application/json" })
    );
    const endPoint = goodsData.goodsId ? `goods/update/${goodsData.goodsId}` : "goods/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      formData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setGoodsRegistErrors(responseData);
    } else if (status == 200) {
      setResponseGoodsData(responseData[0]);
      setResponseGoodsKekkaData(responseData[0]);
    }
  };
  return { responseGoodsData, responseGoodsKekkaData, goodsRegistErrors, goodsRegistAPI };
};
