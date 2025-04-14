import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { texts } from '@/config/texts';
import { useRef } from 'react';
import { useRouter } from 'next/router';
//ホック
import { withAuth } from '@/hocs/withAdminAuth';
import withAdminNoHeaderLayout from '@/hocs/withAdminNoHeaderLayout';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useKengenRedirect } from '@/hooks/useKengenRedirect';
import { useExecutionPermission } from '@/hooks/useExecutionPermission';
//API
import { useGoodsSearchByGoodsIdAPI } from '@/hooks/api/admin/goods/useGoodsSearchByGoodsIdAPI';
import { useLiveBidInfoSearchAPI } from '@/hooks/api/admin/live/bidInfo/useLiveBidInfoSearchAPI';
import { useGoodsSearchBeforeAfterLotAPI } from '@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI';
//型定義
import { GoodsData, initialGoodsData } from '@/types/admin/goods/register';
import { TBidHisotry } from '@/types/admin/live/auctioneer';
import { PageProps } from '@/types/admin/adminPage';
import { Errors } from '@/types/errors';
//コンポーネント
import { KaisaiListPullDown } from '@/components/ui/pulldowns/KaisaiListPullDown';
import { formatPriceDivision, formatPriceMultiplication, formatPriceWithCommas, formatPriceNum } from '@/components/common/PriceUtils';
import ConfirmDialog from '@/components/ui/dialog/confirmDialog';
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
  const { spnKbn } = useRouter().query;

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
  const { fetchLiveBidInfoData, liveBidInfoSearchErrors, liveBidInfoSearchAPI } = useLiveBidInfoSearchAPI();
  const [inputSeatchErrors, setInputSeatchErrors] = useState<Errors>();
  const lotSearch = async () => {
    goodsSearchByGoodsIdAPI(false, 0, searchSelectedKaisai, searchLot);
    liveBidInfoSearchAPI(searchSelectedKaisai, searchLot, searchLot);
  };

  //商品データセット
  useEffect(() => {
    if (fetchGoodsData.goodsId != null) {
      setGoodsData(fetchGoodsData);
      setSearchLot(fetchGoodsData.lot || '');
      setIsCallButtonClicked(true);
    }
  }, [fetchGoodsData]);

  //呼び出しから各価格セット
  const [saiteiRakusatsuPrice, setSaiteiRakusatsuPricePrice] = useState<string>('');
  const [firstPreBidUserId, setFirstPreBidUserId] = useState<number | null>();
  const [firstPreBidPrice, setFirstPreBidPrice] = useState<string>('');
  const [secondPreBidUserId, setSecondPreBidUserId] = useState<number | null>();
  const [secondPreBidPrice, setSecondPreBidPrice] = useState<string>('');
  const [startPrice, setStartPrice] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [nextPrice, setNextPrice] = useState<string>('');
  const [bidUnit, setBidUnit] = useState<string>('');
  const [kenriUserId, setKenriUserId] = useState<number | null>();
  const [kenriUpdatePrice, setKenriUpdatePrice] = useState<string>('');
  useEffect(() => {
    if (fetchLiveBidInfoData) {
      //最低落札価格セット
      if (fetchLiveBidInfoData.saiteiRakusatsuPrice) {
        const formattedSaiteiRakusatsuPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.saiteiRakusatsuPrice.replace(/,/g, '')));
        setSaiteiRakusatsuPricePrice(formattedSaiteiRakusatsuPrice);
      } else {
        setSaiteiRakusatsuPricePrice('');
      }

      //最高事前入札者・価格セット
      if (fetchLiveBidInfoData.firstPreBidPrice) {
        const formattedFirstPreBidPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.firstPreBidPrice.replace(/,/g, '')));
        setFirstPreBidPrice(formattedFirstPreBidPrice);
        setFirstPreBidUserId(fetchLiveBidInfoData.firstPreBidUserId);
      } else {
        setFirstPreBidPrice('');
        setFirstPreBidUserId(null);
      }

      //2番目事前入札者・価格セット
      if (fetchLiveBidInfoData.secondPreBidPrice) {
        const formattedSecondPreBidPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.secondPreBidPrice.replace(/,/g, '')));
        setSecondPreBidPrice(formattedSecondPreBidPrice);
        setSecondPreBidUserId(fetchLiveBidInfoData.secondPreBidUserId);
      } else {
        setSecondPreBidPrice('');
        setSecondPreBidUserId(null);
      }

      //スタート価格セット
      if (fetchLiveBidInfoData.startPrice) {
        const formattedStartPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.startPrice.replace(/,/g, '')));
        setStartPrice(formattedStartPrice);
      } else {
        setStartPrice('');
      }

      //現在価格セット
      if (fetchLiveBidInfoData.currentPrice) {
        const formattedCurrentPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.currentPrice.replace(/,/g, '')));
        setCurrentPrice(formattedCurrentPrice);
      } else {
        setCurrentPrice('');
      }

      //次価格セット
      if (fetchLiveBidInfoData.nextPrice) {
        const formattedNextPrice = formatPriceWithCommas(Number(fetchLiveBidInfoData.nextPrice.replace(/,/g, '')));
        setNextPrice(formattedNextPrice);
      } else {
        setNextPrice('');
      }

      //権利者セット
      if (fetchLiveBidInfoData.kenriUserId) {
        setKenriUserId(fetchLiveBidInfoData.kenriUserId);
      } else {
        setKenriUserId(null);
      }

      //セリ幅セット
      if (fetchLiveBidInfoData.bidUnit) {
        const formattedBidUnit = formatPriceWithCommas(Number(fetchLiveBidInfoData.bidUnit.replace(/,/g, '')));
        setBidUnit(formattedBidUnit);
      } else {
        setBidUnit('');
      }

      //権利者更新処理用
      const saiteiPriceNumber = fetchLiveBidInfoData.saiteiRakusatsuPrice ? Number(fetchLiveBidInfoData.saiteiRakusatsuPrice.replace(/,/g, '')) : 0;
      const firstPreBidPriceNumber = fetchLiveBidInfoData.firstPreBidPrice ? Number(fetchLiveBidInfoData.firstPreBidPrice.replace(/,/g, '')) : 0;
      setKenriUpdatePrice((saiteiPriceNumber > firstPreBidPriceNumber ? saiteiPriceNumber : firstPreBidPriceNumber).toString());
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLiveBidInfoData]);

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
  const getClearCommonData = () => ({
    goodsId: '',
    lot: '',
    goodsName: '',
    goodsImage: '',
  });

  const sendWebSocketMessage = (type: string, additionalData: Record<string, any> = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let message;
      if (type === 'clear') {
        message = {
          type,
          ...getClearCommonData(),
          ...additionalData,
        };
      } else {
        message = {
          type,
          ...getCommonData(),
          ...additionalData,
        };
      }
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
      nextPrice: formatPriceNum(nextPrice),
      currentPrice: formatPriceNum(currentPrice),
    });
    setIsStartButtonClicked(true);
  };

  // 強制クリア用関数
  const lotInputRef = useRef<HTMLInputElement>(null);
  const clear = async () => {
    setSaiteiRakusatsuPricePrice('');
    setFirstPreBidUserId(null);
    setFirstPreBidPrice('');
    setSecondPreBidUserId(null);
    setSecondPreBidPrice('');
    setStartPrice('');
    setCurrentPrice('');
    setNextPrice('');
    setBidUnit('');
    setKenriUserId(null);
    setOnlineBidHistory([]);
    fetchGoodsData.startPrice = '';
    goodsData.goodsName = '';
    goodsData.goodsSetsumei = '';
    goodsData.thumbnailImageUrl = "/no_image.png";
    setSearchLot('');
    setIsCallButtonClicked(false);
    setIsStartButtonClicked(false);
    setIsSetButtonClicked(false);
    
    sendWebSocketMessage('clear', {
      nextPrice: '',
      currentPrice: '',
    });

    setBidComingSoonMsg(false);
    lotInputRef.current?.focus();
  };

  //もうすぐ落札を配信用
  const [isBidComingSoonMsgFlg, setBidComingSoonMsg] = useState(false); 
  const bidComingSoonHaishin = async () => {
    sendWebSocketMessage('bidComingSoon');
    setBidComingSoonMsg(true);
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
    setCurrentPrice(formatPriceWithCommas(newOnlineBid.bidPrice));

    // 最高入札者情報をセット
    const newBidPriceNumber = Number(newOnlineBid.bidPrice);
    const newHighestUserId = 
      newBidPriceNumber > Number(kenriUpdatePrice) 
        ? Number(newOnlineBid.userId) 
        : (newBidPriceNumber == Number(kenriUpdatePrice) && !kenriUserId ? Number(newOnlineBid.userId) : kenriUserId);
    setKenriUserId(newHighestUserId);

    // 次価格を計算してセット
    const nextPriceCalculated = (Number(onlineBidPrice) + Number(bidUnit)).toString();
    setNextPrice(formatPriceDivision(nextPriceCalculated));

    sendWebSocketMessage('updatePrice', {
      bidUserId: newOnlineBid.userId,
      kenriUserId: newHighestUserId,
      nextPrice: nextPriceCalculated,
      currentPrice: newOnlineBid.bidPrice,
    });

    setBidComingSoonMsg(false);
  };

  //オンライン入札価格（ライブオークションは入札後自動で配信）
  useEffect(() => {
    if (onlineBidHistory.length > 0) {
      {spnKbn == "2" && (

        onlinePriceHaishin()
      )} 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineBidHistory]);

  //現在価格を配信用関数
  const currentPriceHaishin = async () => {
    sendWebSocketMessage('updatePrice', {
      nextPrice: formatPriceMultiplication(nextPrice),
      currentPrice: formatPriceMultiplication(currentPrice),
    });
    setBidComingSoonMsg(false);
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
              kaisaiStatus={5}
              spnKbns={typeof spnKbn === 'string' ? [spnKbn] : spnKbn}
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
                <label id="saiteiRakusatsuPrice" className={styles.auctionvalue}>{saiteiRakusatsuPrice}</label>
              </div>
              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.farst_jizen_nyusatsu}</label>
                <label id="firstPreBidUserId" className={styles.auctionuserid}>{firstPreBidUserId}</label>
                <label id="firstPreBidPrice" className={styles.auctionvalue}>{firstPreBidPrice}</label>
              </div>
              <div className={styles.labelRow}>
                <label className={styles.auctionlabel}>{texts.goods.second_jizen_nyusatsu}</label>
                <label id="secondPreBidUserId" className={styles.auctionuserid}>{secondPreBidUserId}</label>
                <label id="secondPreBidPrice" className={styles.auctionvalue}>{secondPreBidPrice}</label>
              </div>
            </div>

            <div>
              <span className={styles.sectionTitle}>オンライン入札履歴</span>
              <ul className={styles.bidList}>
                {onlineBidHistory.map((bid, index) => (
                  <li key={index} className={styles.bidItem}>
                    <span className={styles.bidUserId}>ユーザーID: {bid.userId}</span>
                    <span className={styles.bidPrice}>入札価格: {formatPriceWithCommas(bid.bidPrice)}</span>
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
          <div className={styles.currentInfoDiv}>現在価格：{currentPrice}</div>
          <div className={styles.currentInfoDiv}>現在権利者：{kenriUserId}</div>
          <div className={styles.currentInfoDiv}>セリ幅：{bidUnit}</div>
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
              <label htmlFor="lot" className={styles.goodslabel}>{texts.goods.lot}</label>
              <input
                id="lot"
                type="text"
                name="lot"
                ref={lotInputRef}
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
              <ConfirmDialog
                title={texts.livemessage.confirmClear}
                description=''
                buttonTitle={texts.button.liveClear}
                className={`bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full w-40`}
                dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 rounded-full w-40"
                dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 rounded-full w-40 float-left"
                onSubmit={clear}
                buttonText={texts.button.liveClear}
              />
            </div>
          </div>
          {spnKbn == "1" && (
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
          )}


          {spnKbn == "1" && (
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
          )}
          
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
            <StatusButton onClick={() => bidComingSoonHaishin()} status={1} disabled={!isStartButtonClicked} />
            <StatusButton onClick={() => currentPriceHaishin()} status={2} disabled={!isStartButtonClicked} />
            </div>
            <div className={styles.rightButtons}>
            {spnKbn == "1" && (
              <PriceButton onClick={() => onlinePriceHaishin()} isonline={true} disabled={!isStartButtonClicked} />         
            )}
            {spnKbn == "1" && (
              <PriceButton onClick={() => currentPriceHaishin()} isonline={false} disabled={!isStartButtonClicked} />   
            )}
            </div>
          </div>
          <div className={styles.labelRow}>
            <div className={styles.leftButtons}>
            {spnKbn == "1" && (
              <ResultsButton onClick={() => onlinePriceHaishin()} status={1} disabled={!isStartButtonClicked} />
            )}
            {spnKbn == "1" && (
              <ResultsButton onClick={() => currentPriceHaishin()} status={2} disabled={!isStartButtonClicked} />
            )}
            </div>
            <div className={styles.rightButtons}>

            </div>
          </div>
          {isBidComingSoonMsgFlg && (
            <div className={styles.msgDiv}>
              <span>{texts.button.BidComingSoon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAdminNoHeaderLayout(Page);