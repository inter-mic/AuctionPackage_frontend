import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useAuctionSearchAPI } from "@/hooks/api/common/useAuctionSearchAPI";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  kaisaiStatus: number;
  isLogin: boolean;
};

export const KaisaiListPullDown = ({
  className,
  onChange,
  selectedId,
  kaisaiStatus,
  isLogin,
}: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const { auction } = useAuctionSearchAPI(kaisaiStatus, isLogin);
  const [selectedAuctionSeq, setSelectedAuctionSeq] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedAuctionSeq(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedAuctionSeq !== null) {
      onChange(selectedAuctionSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuctionSeq]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuctionSeq(event.target.value);
  };

  return (
    <select
      id="auctionSeq"
      name="auctionSeq"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedAuctionSeq ?? ""}
    >
      <option value="">---</option>
      {auction.map((data) => (
        <option key={data.auctionSeq} value={data.auctionSeq}>
          {data.auctionName}
        </option>
      ))}
    </select>
  );
};
