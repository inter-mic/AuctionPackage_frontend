import { useState } from "react";
import { TGoodsImageData } from "@/types/common/goodsImage";

interface UsePopupNavigationProps {
  thumImages: TGoodsImageData[];
}

export const usePopupNavigation = ({ thumImages }: UsePopupNavigationProps) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  const handlePopupOpen = (index: number) => {
    setPopupIndex(index);
    setPopupOpen(true);
  };

  // ポップアップ内の左右移動
  const handlePrev = () => {
    setPopupIndex((prev) => (prev - 1 + thumImages.length) % thumImages.length);
  };

  const handleNext = () => {
    setPopupIndex((prev) => (prev + 1) % thumImages.length);
  };

  const handleClose = () => {
    setPopupOpen(false);
  };

  return {
    popupOpen,
    popupIndex,
    handlePopupOpen,
    handlePrev,
    handleNext,
    handleClose,
  };
};

