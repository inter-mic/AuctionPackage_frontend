import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//ボタン
import { ToGoodsListButton } from '@/components/ui/buttons/member/toGoodsListButton';
import { ToLiveApplicationButton } from '@/components/ui/buttons/member/toLiveApplicationButton';
//型定義
import { TAuction } from '@/types/common/MtAuction';
//スタイル
import memberStyles from '@/styles/member/MemberCommon.module.css';
import auctionStyles from '@/styles/member/schedule/Calender.module.css';


interface Props {
  auctionData: TAuction;
  isToGoodsList: boolean;
  isLogin: boolean;
}

const AuctionInfoComponent: React.FC<Props> = ({ auctionData, isToGoodsList, isLogin }) => {
  const { useState, texts } = useCommonSetup();
  const displayStarttimeFormatted = dayjs(auctionData.displayStarttime).format('YYYY年MM月DD日 H:mm');
  const displayEndtimeFormatted = dayjs(auctionData.displayEndtime).format('YYYY年MM月DD日 H:mm');
  const bidStarttimeFormatted = dayjs(auctionData.bidStarttime).format('YYYY年MM月DD日 H:mm');
  const bidEndtimeFormatted = dayjs(auctionData.bidEndtime).format('YYYY年MM月DD日 H:mm');
  const now = dayjs(); // 現在時刻
  const bidStart = auctionData.bidStarttime ? dayjs(auctionData.bidStarttime, "YYYY/MM/DD HH:mm:ss") : null;
  const bidEnd = auctionData.bidEndtime ? dayjs(auctionData.bidEndtime, "YYYY/MM/DD HH:mm:ss") : null;


  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className={auctionStyles.auctionContainer}>
      <div className={`${memberStyles.memberContainer} ${auctionStyles.auctionBlock}`}>

        {auctionData.auctionImageUrl ? (
          <div className={auctionStyles.imageContainer}>
            <Image
              src={auctionData.auctionImageUrl}
              alt=""
              sizes="(max-width: 768px) 100vw, 50vw"
              fill
            />
          </div>
        ) : (
          <span></span>
        )}

        <div className={auctionStyles.textContainer}>
          <div className={auctionStyles.statusContainer}>
            {(auctionData.spnKbn === "3" || auctionData.spnKbn === "4") && (
              bidStart && now.isBefore(bidStart) ? (
                <div className={`${auctionStyles.status} ${auctionStyles.statusBefore}`}>
                  {texts.auction.kaisaiStatus1}
                </div>
              ) : bidEnd && now.isAfter(bidEnd) ? (
                <div className={`${auctionStyles.status} ${auctionStyles.statusAfter}`}>
                  {texts.auction.kaisaiStatus3}
                </div>
              ) : (
                <div className={`${auctionStyles.status} ${auctionStyles.statusDuring}`}>
                  {texts.auction.kaisaiStatus2}
                </div>
              )
            )}

            {auctionData.spnKbn == '1' ? (
              <div className={auctionStyles.spnKbn}>{texts.auction.spnKbn1}</div>
            ) : auctionData.spnKbn == '2' ? (
              <div className={auctionStyles.spnKbn}>{texts.auction.spnKbn2}</div>
            ) : auctionData.spnKbn == '3' ? (
              <div className={auctionStyles.spnKbn}>{texts.auction.spnKbn3}</div>
            ) : auctionData.spnKbn == '4' ? (
              <div className={auctionStyles.spnKbn}>{texts.auction.spnKbn4}</div>
            ) : (
              <div></div>
            )}
          </div>
          <h2 className={auctionStyles.auctionName}>
            {auctionData.auctionName}
          </h2>
          <p className={auctionStyles.kikan}>
            {texts.auction.displayKikan}: {displayStarttimeFormatted}～{displayEndtimeFormatted}
          </p>
          <p className={auctionStyles.kikan}>
            {texts.auction.bidKikan}: {bidStarttimeFormatted}～{bidEndtimeFormatted}
          </p>

          {auctionData.auctionListUrl != null && (
            <div className={auctionStyles.goodsList}>
              {texts.auction.GoodsListLabel}:
              <Link className="text-blue-600 underline" href={auctionData.auctionListUrl} target="_blank">
                {texts.label.download}
              </Link>
            </div>
          )}

          {isToGoodsList && (
            <ToGoodsListButton auctionSeq={auctionData.auctionSeq} isLogin={isLogin} />
          )}
          {auctionData.spnKbn == '1' ? (
          <ToLiveApplicationButton auctionSeq={auctionData.auctionSeq} />  
          ) : (
              <div></div>
            )}
            

          {auctionData.auctionGaiyo && (
            <>
              <button
                onClick={toggleExpand}
                className={auctionStyles.toggleButton}
              >
                {isExpanded ? texts.auction.auctionGaiyoClose : texts.auction.auctionGaiyoOpen}
              </button>
              <div
                className={`${auctionStyles.auctionGaiyo} ${isExpanded ? auctionStyles.auctionGaiyoExpanded : ''
                  }`}
              >
                <div
                  className={`${auctionStyles.auctionGaiyo} ${isExpanded ? auctionStyles.auctionGaiyoExpanded : ''}`}
                  dangerouslySetInnerHTML={{ __html: auctionData.auctionGaiyo.replace(/(\r\n|\n|\r)/g, '<br>') }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>

  );
};

export default AuctionInfoComponent;
