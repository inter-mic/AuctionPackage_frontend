import { useState } from "react";
//型定義
import { TMarketSearchRequest } from "@/types/member/market";

export const useMarketSearchParams = () => {
  const [marketParams, setMarketParams] = useState<TMarketSearchRequest>({
    goodsId: "",
    auctionKikanFrom: "",
    auctionKikanTo: "",
    categorySeq: "",
    rakusatsuPriceFrom: "",
    rakusatsuPriceTo: "",
    freeWord: "",
    pageNumber: 1,
    pageSize: 50,
  });

  const formChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setMarketParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setMarketParams(() => ({
      goodsId: "",
      auctionKikanFrom: "",
      auctionKikanTo: "",
      categorySeq: "",
      rakusatsuPriceFrom: "",
      rakusatsuPriceTo: "",
      freeWord: "",
      pageNumber: 1,
      pageSize: 50,
    }));
  };

  return { marketParams, formChange, resetForm };
};
