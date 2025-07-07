import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocale } from "@/hooks/useLocale";
import { useSearchNextLiveAuctionAPI } from "@/hooks/api/member/live/useSearchNextLiveAuctionAPI";
import { TAuction } from "@/types/common/MtAuction";
import styles from "@/styles/member/Live/Bid.module.css";

interface Props {
  texts: any;
}

const NoLiveAuctionComponent: React.FC<Props> = ({ texts }) => {
  const { nextAuction } = useSearchNextLiveAuctionAPI();
  const [fetchNextAuction, setFetchNextAuction] = useState<TAuction>();
  const [fetchAuctionDate, setFetcheAuctionDate] = useState<string>("");

  useEffect(() => {
    setFetchNextAuction(nextAuction);
  }, [nextAuction]);

  useEffect(() => {
    if (fetchNextAuction && fetchNextAuction.auctionDatetime) {
      const formattedDate = dayjs(fetchNextAuction.auctionDatetime).format("YYYY/MM/DD HH:mm");
      setFetcheAuctionDate(formattedDate);
    } else {
      setFetcheAuctionDate("未定");
    }
  }, [fetchNextAuction]);

  return (
    <div className={styles.noLiveContainer}>
      <div>
        <p>
          {texts.live.noLiveAuction1}
          <span style={{ color: "red" }}> {fetchAuctionDate} </span>
          {texts.live.noLiveAuction2}
        </p>
      </div>
      <div>
        <p>{texts.live.noLiveAuction3}</p>
      </div>
    </div>
  );
};

export default NoLiveAuctionComponent;
