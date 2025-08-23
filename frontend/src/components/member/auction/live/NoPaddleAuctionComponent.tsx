import React from "react";
import styles from "@/styles/member/liveAuction/Bid.module.css";

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
