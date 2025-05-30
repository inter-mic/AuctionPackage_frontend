import React from "react";
import statusStyles from "@/styles/member/goods/AuctionStatus.module.css";
interface Props {
  bidStatus: number | null;
  texts: {
    bidStatus1: string;
    bidStatus2: string;
    bidStatus3: string;
    bidStatus4: string;
    bidStatus5: string;
  };
}

const LiveBidStatusComponent: React.FC<Props> = ({ bidStatus, texts }) => {
  // ステータスに基づいて表示する内容を決定
  const bidStatusText =
    bidStatus === 1
      ? texts.bidStatus1
      : bidStatus === 2
      ? texts.bidStatus2
      : bidStatus === 3
      ? texts.bidStatus3
      : bidStatus === 4
      ? texts.bidStatus4
      : bidStatus === 5
      ? texts.bidStatus5
      : "";

  const statusClass = `${statusStyles.bidStatusContainer} ${
    statusStyles[`bidStatus${bidStatus}`]
  }`;
  return <div className={statusClass}>{bidStatusText}</div>;
};

export default LiveBidStatusComponent;
