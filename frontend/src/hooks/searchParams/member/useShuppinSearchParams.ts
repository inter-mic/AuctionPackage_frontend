import { useState } from "react";
//型定義
import { TSpnSearchRequest } from "@/types/member/shuppin";

export const useShuppinSearchParams = () => {
  const [searchParams, setSearchParams] = useState<TSpnSearchRequest>({
    goodsName: "",
    lot: "",
    auctionSeq: "",
    auctionKekka: "",
  });

  const formChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setSearchParams({
      goodsName: "",
      lot: "",
      auctionSeq: "",
      auctionKekka: "",
    });
  };

  return { searchParams, formChange, resetForm };
};
