import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { texts } from '@/config/texts';
import { useRef } from 'react';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminNoHeaderLayout from '@/hocs/withAdminNoHeaderLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useGoodsSearchByGoodsIdAPI } from '@/hooks/api/admin/goods/useGoodsSearchByGoodsIdAPI';
import { useGoodsSearchBeforeAfterLotAPI } from '@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI';
//型定義
import { GoodsData, initialGoodsData } from '@/types/admin/goods/register';
import { TBidHisotry } from '@/types/admin/live/auctioneer';
import { PageProps } from '@/types/admin/adminPage';
import { Errors } from '@/types/errors';
//コンポーネント
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { formatPriceDivision, formatPriceMultiplication, formatPriceWithCommas } from '@/components/common/PriceUtils';

//ボタン
import { CallButton } from '@/components/ui/buttons/admin/live/callButton';
import { LotBeforeAffterButton } from '@/components/ui/buttons/admin/live/LotBeforeAffterButton';
import { SetButton } from '@/components/ui/buttons/admin/live/setButton';
import { StartButton } from '@/components/ui/buttons/admin/live/startButton';
import { ClearButton } from '@/components/ui/buttons/admin/live/clearButton';
import { SerihabaButton } from '@/components/ui/buttons/admin/live/serihabaButton';
import { PriceButton } from '@/components/ui/buttons/admin/live/priceButton';
import { StatusButton } from '@/components/ui/buttons/admin/live/statusButton';
import { ResultsButton } from '@/components/ui/buttons/admin/live/resultsButton';



//スタイル
import styles from '@/styles/admin/Auctioneer.module.css';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminAuctionner
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();
  useKengenRedirect(kengen, 304);
  const { executionPermission } = useExecutionPermission(kengen);
  const [goodsData, setGoodsData] = useState<GoodsData>(initialGoodsData);

  const [searchSelectedKaisai, setSearchSelectedKaisai] = useState<string>('');
  const [searchLot, setSearchLot] = useState<string>('');
  const handleSearchKaisaiChange = (name: string, value: string) => {
    setSearchSelectedKaisai(value);

  };
  const handleSearchLotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLot(e.target.value);
  };

  const [isCallButtonClicked, setIsCallButtonClicked] = useState(false);
  const [isSetButtonClicked, setIsSetButtonClicked] = useState(false);
  const [isStartButtonClicked, setIsStartButtonClicked] = useState(false);
  //検索
  const { fetchGoodsData, goodsSearchErrors, goodsSearchByGoodsIdAPI } = useGoodsSearchByGoodsIdAPI();
  const [inputSeatchErrors, setInputSeatchErrors] = useState<Errors>();
  const lotSearch = async () => {
    goodsSearchByGoodsIdAPI(false, 0, searchSelectedKaisai, searchLot);
  };

  //商品データセット
  useEffect(() => {
    if (fetchGoodsData.goodsId != null) {
      setGoodsData(fetchGoodsData);
      setSearchLot(fetchGoodsData.lot || '');
      setIsCallButtonClicked(true);
    }
  }, [fetchGoodsData]);
  useEffect(() => {
    if (fetchGoodsData.startPrice) {
      const formattedPrice = formatPriceWithCommas(Number(fetchGoodsData.startPrice.replace(/,/g, '')) / 1000);
      setCurrentPrice(formattedPrice);
      setNextPrice(formattedPrice);
    } else {
      setCurrentPrice('');
      setNextPrice('');
    }
  }, [fetchGoodsData.startPrice]);

  //LOT前後
  const { beforeAfterGoodsId, goodsSearchBeforeAfterLotAPI } = useGoodsSearchBeforeAfterLotAPI();
  useEffect(() => {
    const auctionSeq = fetchGoodsData?.auctionSeq ?? 0;
    const lot = fetchGoodsData?.lot ?? '';
    if (auctionSeq != 0 && lot != "") {
      goodsSearchBeforeAfterLotAPI(auctionSeq, lot, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData?.auctionSeq, fetchGoodsData?.lot]);
  const lotBeforeAffterSearch = async (isBefore: boolean) => {
    const goodsId = isBefore ? beforeAfterGoodsId?.beforeGoodsId : beforeAfterGoodsId?.afterGoodsId;
    await goodsSearchByGoodsIdAPI(true, Number(goodsId), "", "");
  };

  const [onlineBidHistory, setOnlineBidHistory] = useState<TBidHisotry[]>([]);
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    // WebSocketの初期化
    ws.current = new WebSocket('ws://localhost:3001/');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      ws.current?.send(JSON.stringify({ type: 'admin' }));
    };

    ws.current.onmessage = (event) => {
      var data = JSON.parse(event.data);
      if (data.type === 'set') {
        setIsSetButtonClicked(true);
      } else if (data.type === 'start') {
        setIsStartButtonClicked(true);
        setIsSetButtonClicked(false);
      } else if (data.type === 'onlineBid') {
        setOnlineBidHistory((prevHistory) => [
          { userId: data.userId, bidPrice: data.bidPrice },
          ...prevHistory, // 最新のデータを上部に追加
        ]);
      }

      if (data.type === 'connectionCount') {
        console.log(`Current connections: ${data.count}`);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const getCommonData = () => ({
    goodsId: fetchGoodsData.goodsId,
    lot: fetchGoodsData.lot,
    goodsName: fetchGoodsData.goodsName,
    goodsImage: fetchGoodsData.thumbnailImageUrl,
  });
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [nextPrice, setNextPrice] = useState<string>('');
  const [kenriUserId, setKenriUserId] = useState<string>('');
  const [kenriPrice, setKenriPrice] = useState<string>('');

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

  // セットボタン用関数
  const set = async () => {
    sendWebSocketMessage('set');
  };

  // スタートボタン用関数
  const start = async () => {
    sendWebSocketMessage('start', {
      nextPrice: formatPriceMultiplication(nextPrice),
      currentPrice: formatPriceMultiplication(currentPrice),
    });
    setIsStartButtonClicked(true);
    setKenriPrice(formatPriceMultiplication(currentPrice).toLocaleString());
  };

  //オンライン入札価格を配信用
  const onlinePriceHaishin = async () => {
    if (onlineBidHistory.length === 0) {
      console.error('オンライン入札履歴が空です');
      return;
    }

    const newOnlineBid = onlineBidHistory[0]; // 最新の入札履歴を取得
    const onlineBidPrice = newOnlineBid.bidPrice;
    const bidUnit = Number(fetchGoodsData?.bidUnit?.replace(/,/g, '') || '0');
    // 現在価格を最新の入札価格に更新
    setCurrentPrice(formatPriceDivision(newOnlineBid.bidPrice));

    // 次価格を計算してセット
    const nextPriceCalculated = (Number(onlineBidPrice) + Number(bidUnit)).toString();
    setNextPrice(formatPriceDivision(nextPriceCalculated));
    sendWebSocketMessage('updatePrice', {
      kenriUserId: newOnlineBid.userId,
      nextPrice: nextPriceCalculated,
      currentPrice: newOnlineBid.bidPrice,
    });

    setKenriPrice(formatPriceMultiplication(currentPrice).toLocaleString());
  };

  //現在価格を配信用関数
  const currentPriceHaishin = async () => {
    sendWebSocketMessage('updatePrice', {
      nextPrice: formatPriceMultiplication(nextPrice),
      currentPrice: formatPriceMultiplication(currentPrice),
    });
  };
  useEffect(() => {
    if (goodsSearchErrors) { setInputSeatchErrors(goodsSearchErrors); }
  }, [goodsSearchErrors]);


  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.topLeft}>
          <div className={styles.labelRow}>
            <label className={styles.goodslabel}>{texts.goods.auctionName}</label>
            <KaisaiListPullDown
              className={`${styles.select} ${inputSeatchErrors?.auctionSeq ? 'bg-red-300' : ''}`}
              onChange={(value) => handleSearchKaisaiChange('auctionSeq', value)}
              selectedId={searchSelectedKaisai !== null ? String(searchSelectedKaisai) : ''}
              kaisaiStatus={0}
            />

          </div>

          <div className={styles.labelRow}>
            <label className={styles.goodslabel}>{texts.goods.goodsName}</label>
            <label id="goodsName" className={styles.goodsvalue}>{goodsData.goodsName || ''}</label>
          </div>

          <div className={styles.labelRow}>
            <label className={styles.goodslabel}>{texts.goods.goodsSetsumei}</label>
            <label id="goodsSetsumei" className={styles.goodsvalue}>{goodsData.goodsSetsumei || ''}</label>
          </div>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            marginBottom: '20px'
          }}>
            <Image
              src={goodsData.thumbnailImageUrl ?? "/no_image.png"}
              alt=""
              fill
              quality={100}
              loading="lazy"
              style={{ objectFit: 'contain' }}
            />
          </div>



        </div>
        <div className={styles.bottomLeft}>
          <span className={styles.sectionTitle}>次商品</span>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.topRight}>
          <div className={styles.gridContainer}>
            <div>

              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.saiteiRakusatsuPrice}</label>
                <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}>{goodsData.saiteiRakusatsuPrice || ''}</label>
              </div>
              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.estimate}</label>
                <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}></label>
              </div>
              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.farst_jizen_nyusatsu}</label>
                <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}></label>
              </div>
              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.second_jizen_nyusatsu}</label>
                <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}></label>
              </div>
            </div>

            <div>
              <span className={styles.sectionTitle}>オンライン入札履歴</span>
              <ul className={styles.bidList}>
                {onlineBidHistory.map((bid, index) => (
                  <li key={index} className={styles.bidItem}>
                    <span className={styles.bidUserId}>ユーザーID: {bid.userId}</span>
                    <span className={styles.bidPrice}>入札価格: {bid.bidPrice}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className={styles.sectionTitle}>配信履歴</span>
            </div>
          </div>
        </div>

        <div className={styles.centerRight}>
          現在価格：{kenriPrice}
          現在権利者：
          セリ幅：
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
              <label htmlFor="lot" className={styles.goodslabel}>{texts.goods.lot}</label>
              <input
                id="lot"
                type="text"
                name="lot"
                value={searchLot}
                onChange={handleSearchLotChange}
                className={`border p-2 rounded h-10 w-40
                    ${inputSeatchErrors?.lot ? 'bg-red-300' : ''}`}
              />

              <CallButton onClick={lotSearch} />
              <LotBeforeAffterButton onClick={() => lotBeforeAffterSearch(true)} isBefore={true} disabled={!isCallButtonClicked} />
              <LotBeforeAffterButton onClick={() => lotBeforeAffterSearch(false)} isBefore={false} disabled={!isCallButtonClicked} />
            </div>
            <div className={styles.rightButtons}>
              <SetButton onClick={set} disabled={!isCallButtonClicked} />
              <StartButton onClick={start} disabled={!isSetButtonClicked} />
              <ClearButton onClick={start} disabled={!isSetButtonClicked} />
            </div>
          </div>
          <div className={styles.priceSection}>
            <div className={styles.priceGroup}>
              <span className={styles.priceLabel}>次価格</span>
              <input
                type="text"
                className={styles.priceInput}
                value={nextPrice}
                onChange={(e) => setNextPrice(e.target.value)}
              />
              <span>,000</span>

              <span className={styles.priceLabel}>現在価格</span>
              <input
                type="text"
                className={styles.priceInput}
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
              />
              <span>,000</span>
            </div>
          </div>



          <div className={styles.adjustButtons}>
            <SerihabaButton
              isplus={false}
              disabled={!isStartButtonClicked}
              currentPrice={currentPrice}
              nextPrice={nextPrice}
              fetchGoodsData={fetchGoodsData}
              onUpdatePrices={(newCurrentPrice, newNextPrice) => {
                setCurrentPrice(newCurrentPrice);
                setNextPrice(newNextPrice);
              }}
            />

            <SerihabaButton
              isplus={true}
              disabled={!isStartButtonClicked}
              currentPrice={currentPrice}
              nextPrice={nextPrice}
              fetchGoodsData={fetchGoodsData}
              onUpdatePrices={(newCurrentPrice, newNextPrice) => {
                setCurrentPrice(newCurrentPrice);
                setNextPrice(newNextPrice);
              }}
            />
          </div>
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
            <StatusButton onClick={() => onlinePriceHaishin()} status={1} disabled={!isStartButtonClicked} />
            <StatusButton onClick={() => currentPriceHaishin()} status={2} disabled={!isStartButtonClicked} />
            </div>
            <div className={styles.rightButtons}>
            <PriceButton onClick={() => onlinePriceHaishin()} isonline={true} disabled={!isStartButtonClicked} />
            <PriceButton onClick={() => currentPriceHaishin()} isonline={false} disabled={!isStartButtonClicked} />
            </div>
          </div>
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
            <ResultsButton onClick={() => onlinePriceHaishin()} status={1} disabled={!isStartButtonClicked} />
            <ResultsButton onClick={() => currentPriceHaishin()} status={2} disabled={!isStartButtonClicked} />
            </div>
            <div className={styles.rightButtons}>

            </div>
          </div>





        </div>
      </div>
    </div>
  );
};

export default withAdminNoHeaderLayout(Page);