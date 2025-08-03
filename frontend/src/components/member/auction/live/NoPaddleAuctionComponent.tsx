import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocale } from "@/hooks/useLocale";
import { useSearchNextLiveAuctionAPI } from "@/hooks/api/member/live/useSearchNextLiveAuctionAPI";
import { TAuction } from "@/types/common/MtAuction";
import styles from "@/styles/member/liveAuctionBid.module.css";

interface Props {
  texts: any;
}

const NoPaddleAuctionComponent: React.FC<Props> = ({ texts }) => {
  return (
    <div className={styles.noLiveContainer}>
      <div>
        <p>{texts.live.noLiveAuction4}</p>
      </div>
    </div>
  );
};

export default NoPaddleAuctionComponent;
