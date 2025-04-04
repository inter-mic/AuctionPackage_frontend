import { GetServerSideProps } from 'next';
import { useEffect, useState, useRef } from 'react';
import { texts } from '@/config/texts';
import Image from 'next/image';
//ホック
import { withAuth } from '@/hocs/withMemberAuth';
import withMemberLayout from '@/hocs/withMemberLayout';
//カスタムフック

//型定義
import { TBidHisotry } from '@/types/member/live';
import { TPageProps } from '@/types/member/memberPage';
//コンポーネント
import LiveBidStatusComponent  from '@/components/member/auction/live/LiveBidStatusComponent';
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
  const ws = useRef<WebSocket | null>(null);
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
        setBidStatus(loginUserId === data.kenriUserId ? 1 : 0);
      }
      if (data.type === 'start') {
        setIsBidDisabled(false);
       
      }   
      if (data.type === 'updatePrice') {
        setIsBidDisabled(loginUserId === data.kenriUserId);
        setBidHistory((prevHistory) => [{ bidPrice: data.currentPrice, userId: data.kenriUserId, timestamp: data.timestamp }, ...prevHistory]);
      }
      if (data.type === 'bidComingSoon') {
        setBidComingSoonMsg(true);
      } else {
        setBidComingSoonMsg(false);
      }
      if (data.type === 'clear') {
        setBidHistory([]);
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
    <div className={memberStyles.memberContainer}>
      <div className={styles.liveContainer}>
        <div className={styles.leftSection}>
          <div >
            <Image
              src={receivedData?.goodsImage ?? "/no_image.png"}
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
                <label className={styles.currentPrice}>
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
          {isBidComingSoonMsgFlg && (
            <div className={styles.msgDiv}>
              <span>{texts.button.BidComingSoon}</span>
            </div>
          )}

        </div>
        <div className={styles.rightSection}>
        <ul className={styles.bidList}>
                {bidHistory.map((bid, index) => (
                 <li key={index} className={styles.bidItem}>
                   {bid.userId === PageProps.userId && (
                      <span className={styles.bidUserId}>your bid</span>
                    )}
                  <span className={styles.bidPrice}>{bid.bidPrice}</span>
                </li>
                ))}
              </ul>
        </div>
      </div>
    </div>
  );
};

export default withMemberLayout(Page);