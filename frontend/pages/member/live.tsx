import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { useEffect, useState, useRef } from 'react';
import { texts } from '@/config/texts';
import Image from 'next/image';
//ホック
import { withAuth } from '@/hocs/withMemberAuth';
import withMemberLayout from '@/hocs/withMemberLayout';
//API
import { useCheckLiveAuctionAPI } from '@/hooks/api/member/live/useCheckLiveAuctionAPI';
import { useSearchNextLiveAuctionAPI } from '@/hooks/api/member/live/useSearchNextLiveAuctionAPI';
//型定義
import { TBidHisotry } from '@/types/member/live';
import { TPageProps } from '@/types/member/memberPage';
import { NextLotList } from '@/types/admin/live/nextLotList';
import {  TAuction } from '@/types/common/MtAuction';
//コンポーネント
import LiveBidStatusComponent  from '@/components/member/auction/live/LiveBidStatusComponent';
import { formatPriceWithCommas } from '@/components/common/PriceUtils';
//ボタン
import { LiveBidButton } from '@/components/ui/buttons/member/liveBidButton';
//スタイル
import memberStyles from '@/styles/member/MemberCommon.module.css';
import styles from '@/styles/member/Live.module.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberLive
    },
  };
});

const Page: React.FC<TPageProps> = (PageProps) => {
  const [viewOnlyChecked, setViewOnlyChecked] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<any>(null);
  const [isBidDisabled, setIsBidDisabled] = useState(true); 
  const [bidStatus, setBidStatus] = useState(0); 
  const [bidHistory, setBidHistory] = useState<TBidHisotry[]>([]);
  const [isBidComingSoonMsgFlg, setBidComingSoonMsg] = useState(false);
  const [isRakusatsuProcessingMsgFlg, setRakusatsuProcessingMsgFlg] = useState(false);
  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const [nextLotList, setNextLotList] = useState<NextLotList[]>([]);
  const [msg, setMsg] = useState<string | null>();
  const [marqueeKey, setMarqueeKey] = useState(0);

  const ws = useRef<WebSocket | null>(null);

  const { isLiveAuction } = useCheckLiveAuctionAPI();
  const [ isFetchLiveAuction, setIsFetchLiveAuction] = useState<boolean>(false);
  useEffect(() => {
    setIsFetchLiveAuction(isLiveAuction);
  }, [isLiveAuction]); 
  const { nextAuction } = useSearchNextLiveAuctionAPI();
  const [ fetchNextAuction, setFetchNextAuction] = useState<TAuction>();
  useEffect(() => {
    setFetchNextAuction(nextAuction);
  }, [nextAuction]); 
  const [ fetchAuctionDate, setFetcheAuctionDate] = useState<string>("");
useEffect(() => {
   if (fetchNextAuction && fetchNextAuction.auctionDatetime) {
     const formattedDate = dayjs(fetchNextAuction.auctionDatetime).format('YYYY/MM/DD HH:mm');
  setFetcheAuctionDate(formattedDate);
  } else {
    setFetcheAuctionDate("未定");
  }
}, [fetchNextAuction]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001/');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };
    const loginUserId = PageProps.userId;
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);      
      if (data.type === 'set' || data.type === 'start' || data.type === 'updatePrice' || data.type === 'clear') {
        setReceivedData(data);
        setBidStatus(loginUserId === data.kenriUserId 
          ? 1 
          : (data.isBelowSaiteiPriceFlg ? 5 : 0)
        );
      }
      if (data.type === 'set') {
        setBidHistory([]);
        setNextLotList(data.nextLotList);
      }   
      if (data.type === 'start') {
        setIsBidDisabled(false);
      }   
      if (data.type === 'updatePrice') {
        setIsBidDisabled(loginUserId === data.kenriUserId);
        setBidHistory((prevHistory) => [{ bidPrice: data.currentPrice, userId: data.bidUserId, timestamp: data.timestamp }, ...prevHistory]);
        setIsPriceUpdated(true);
        setTimeout(() => setIsPriceUpdated(false), 1000);
      }
      if (data.type === 'bidComingSoon') {
        setBidComingSoonMsg(true);
      } else {
        setBidComingSoonMsg(false);
      }
      if (data.type === 'rakusatsuProcessing') {
        setRakusatsuProcessingMsgFlg(true);
        setIsBidDisabled(true);
      } else {
        setRakusatsuProcessingMsgFlg(false);
        setIsBidDisabled(false);
      }
      if (data.type === 'bidEnd') {
        setIsBidDisabled(true);
        setReceivedData(data);
        setBidStatus(!data.kenriUserId ? 4 : (loginUserId === data.kenriUserId ? 2 : 3));
      }
      if (data.type === 'clear') {
        setBidHistory([]);
        setIsBidDisabled(true);
        setNextLotList([]);
      }
      if (data.type === 'sendMessage') {
        setMsg(data.message);
        setMarqueeKey(k=>k+1);
      }
      
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewOnlyCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewOnlyChecked(event.target.checked);
  };

  const getCommonData = () => ({
    userId: PageProps.userId
  });
  const sendWebSocketMessage = (type: string, additionalData: Record<string, any> = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type,
        ...getCommonData(),
        ...additionalData,
      };
      ws.current.send(JSON.stringify(message));
    } else {
      console.error(`[${type.toUpperCase()}] WebSocket is not open`);
    }
  };

  // 入札用関数
  const bid = async () => {
    const currentTime = new Date().toISOString(); 
    sendWebSocketMessage('onlineBid', {
      bidPrice: receivedData?.nextPrice,
      timestamp: currentTime 
    });
  };

  return (
    !isFetchLiveAuction ? (
      <div className={styles.noLiveContainer}>
        <div>
          <p>{texts.live.noLiveAuction1}<span style={{color: 'red'}}> {fetchAuctionDate}  </span>{texts.live.noLiveAuction2}</p>
        </div>
        <div>
          <p>{texts.live.noLiveAuction3}</p>
        </div>
        
        
      </div>
      
    ) : (
      <div className={memberStyles.memberContainer}>
      <div className={styles.liveContainer}>
        <div className={styles.leftSection}>
          <div >
            <Image
              src={receivedData?.goodsImage || "/no_image.png"}
              alt=""
              width={300}
              height={300}
              loading="lazy"
              style={{ marginLeft: '25%' }}
            />
          </div>
          <div className={styles.lot}>
            <label>LOT {receivedData?.lot}</label>
          </div>
          <div className={styles.goodsName}>
            <label>{receivedData?.goodsName}</label>
          </div>
          <LiveBidStatusComponent bidStatus={bidStatus} texts={texts.live}/>
          <div className={styles.bidSection}>
            <div className={styles.priceContainer}>
              <div className={styles.priceInfo}>
                <span className={styles.currentPriceLabel}>{texts.goods.currentPrice}</span>
                <label className={`${styles.currentPrice} ${isPriceUpdated ? styles.priceUpdated : ""}`}>
                  \{receivedData?.currentPrice && new Intl.NumberFormat('ja-JP').format(receivedData.currentPrice)}
                  </label>
              </div>
              {!viewOnlyChecked && (
                <LiveBidButton 
                  onClick={bid} 
                  disabled={isBidDisabled} 
                  text={receivedData?.nextPrice && new Intl.NumberFormat('ja-JP').format(receivedData.nextPrice)} />
              )}
            </div>
            <div className={styles.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                  checked={viewOnlyChecked} 
                  onChange={handleViewOnlyCheckboxChange}
                    sx={{
                      color: 'gray', 
                      '&.Mui-checked': {
                        color: '#cb5201',
                      },
                      width: 40, 
                      height: 40, 
                      '& .MuiSvgIcon-root': {
                        fontSize: 32, 
                      },
                    }}
                  />
                }
                label="View Only"
              />

            </div>
          </div>
        </div>
        <div className={styles.flowingMsgDiv}>
          <span key={marqueeKey} className={styles.marquee}>{msg}</span>
        </div>
        <div className={styles.msgDiv}>
          {isBidComingSoonMsgFlg && (<span>{texts.button.BidComingSoon}</span>)}
          {isRakusatsuProcessingMsgFlg && (<span>{texts.livemessage.rakusatsuProcessMsg}</span>          )}
        </div>
        <div className={styles.rightSection}>
          <ul className={styles.bidList}>
            {bidHistory.map((bid, index) => (
              <li key={index} className={styles.bidItem}>
                {bid.userId === PageProps.userId && (
                  <span className={styles.bidUserId}>your bid</span>
                )}
              <span className={bid.userId === PageProps.userId ? styles.bidPriceYourBid : styles.bidPrice}>{formatPriceWithCommas(bid.bidPrice)}</span>
            </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.nextLotListContainer}>
        {nextLotList.length > 1 ? (
          nextLotList.slice(1).map((item: NextLotList, idx: number) => (
            <div key={idx} className={styles.nextLotCard}>
              <div className={styles.nextLotImageWrapper}>
                <Image
                  src={item.thumbnailImageUrl || "/no_image.png"}
                  alt={item.goodsName || ""}
                  fill
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div className={styles.nextLotCaption}>
                <div className={styles.nextLotName}>{item.goodsName}</div>
                <div className={styles.nextLotLot}>LOT {item.lot}</div>
                <div className={styles.nextLotPrice}>
                \{item.startPrice || new Intl.NumberFormat('ja-JP').format(Number(item.startPrice))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.nextLotEmpty}>次の商品はありません</div>
        )}
      </div>
    </div>
    )
  );

};

export default withMemberLayout(Page);