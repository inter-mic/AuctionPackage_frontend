import React from 'react';
import statusStyles from '@/styles/member/goods/AuctionStatus.module.css';
interface Props {
  auctionTimeStatus: number;
  currentKenriUserId: number| "";
  loginUserId: number | null;
  texts: {
    auctionStatus1: string;
    auctionStatus2: string;
    auctionStatus3: string;
    auctionStatus4: string;
    auctionStatus5: string;
  };
  bidPrice: string | "";
  saiteiRakusatsuPriceOverFlg: boolean;
  isDetail: boolean;
}

const AuctionStatusComponent: React.FC<Props> = ({
  auctionTimeStatus,
  currentKenriUserId,
  loginUserId,
  texts,
  bidPrice,
  saiteiRakusatsuPriceOverFlg,
  isDetail,
}) => {

  const currentKenriUserIdStr = String(currentKenriUserId); 
  let auctionStatus = 0;
  if (auctionTimeStatus === 3 && currentKenriUserIdStr !== "" && loginUserId == currentKenriUserId) {
    auctionStatus = 1; // 終了かつ自分が落札
  } else if (auctionTimeStatus === 2 && loginUserId == currentKenriUserId) {
    auctionStatus = 3; // 開催中かつ自分が権利
  } else if (auctionTimeStatus === 2 && bidPrice != "" && !saiteiRakusatsuPriceOverFlg) {
    auctionStatus = 5; // 開催中かつ自分が入札しているが最低落札価格に到達してない
  } else if (auctionTimeStatus === 2 && bidPrice != "" && currentKenriUserIdStr !== "" &&   loginUserId != currentKenriUserId) {
    auctionStatus = 4; // 開催中かつ自分が入札しているが権利ではない

  }
  // ステータスに基づいて表示する内容を決定
  const auctionStatusText =
    auctionStatus === 1 ? texts.auctionStatus1 :
    auctionStatus === 2 ? texts.auctionStatus2 :
    auctionStatus === 3 ? texts.auctionStatus3 :
    auctionStatus === 4 ? texts.auctionStatus4 :
    auctionStatus === 5 ? texts.auctionStatus5 :
    '';

    let statusClass = '';
    if(isDetail){
        statusClass = `${statusStyles.auctionStatusDetailContainer} ${statusStyles[`auctionDetailStatus${auctionStatus}`] } `;
    }else{
        statusClass = `${statusStyles.auctionStatus} ${statusStyles[`auctionStatus${auctionStatus}`]}`;
    }

    return <div className={statusClass}>{auctionStatusText}</div>;
};

export default AuctionStatusComponent;
