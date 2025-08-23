import { useState } from "react";
import { TGoodsImageData } from "@/types/common/goodsImage";

interface UseImageClickHandlerProps {
  thumImages: TGoodsImageData[];
  mainImageSrc: string;
  setMainImageSrc: (src: string) => void;
  enablePopup?: boolean;
  onPopupOpen?: (index: number) => void;
}

export const useImageClickHandler = ({
  thumImages,
  mainImageSrc,
  setMainImageSrc,
  enablePopup = false,
  onPopupOpen,
}: UseImageClickHandlerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  //サムネイル画像クリック
  const handleImageClick = (thumbnailUrl: string) => {
    const newImageUrl = thumbnailUrl.replace("thumb", "square");
    setMainImageSrc(newImageUrl);
    setSelectedImage(thumbnailUrl);
  };

  // メイン画像クリック時
  const handleMainImageClick = () => {
    if (enablePopup && onPopupOpen) {
      // selectedImageがある場合はそのインデックス、なければmainImageSrcで検索
      let idx = 0;
      if (selectedImage) {
        idx = thumImages.findIndex((img) => selectedImage === img.thumbnailImageUrl);
      } else {
        idx = thumImages.findIndex((img) => mainImageSrc.includes(img.squareImageUrl || ""));
      }
      onPopupOpen(idx >= 0 ? idx : 0);
    }
  };

  return {
    selectedImage,
    setSelectedImage,
    handleImageClick,
    handleMainImageClick,
  };
};
