import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState, useRef } from "react";
import { getTexts } from "@/config/texts";
import Image from "next/image";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//API
import { useCheckLiveAuctionAPI } from "@/hooks/api/member/live/useCheckLiveAuctionAPI";
import { useSearchPaddleNoAPI } from "@/hooks/api/member/live/useSearchPaddleNoAPI";
import { useSystemSearchAPI } from "@/hooks/api/member/useSystemSearchAPI";
//カスタムフック
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLocale } from "@/hooks/useLocale";
//型定義
import { TBidHisotry } from "@/types/member/live";
import { TPageProps } from "@/types/member/memberPage";
import { NextLotList } from "@/types/common/nextLotList";
//コンポーネント
import LiveBidStatusComponent from "@/components/member/auction/live/LiveBidStatusComponent";
import NoLiveAuctionComponent from "@/components/member/auction/live/NoLiveAuctionComponent";
import NoPaddleAuctionComponent from "@/components/member/auction/live/NoPaddleAuctionComponent";
import NextLotListComponent from "@/components/common/live/NextLotListComponent";
import { formatPriceWithCommas } from "@/components/common/PriceUtils";
//ボタン
import { LiveBidButton } from "@/components/ui/buttons/member/liveBidButton";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/Live/Bid.module.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberLive,
    },
  };
});

const Page: React.FC<TPageProps> = (PageProps) => {
  const [viewOnlyChecked, setViewOnlyChecked] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<any>(null);
  const [isBidDisabled, setIsBidDisabled] = useState(true);
  const [bidStatus, setBidStatus] = useState(0);
  const [bidResults, setBidResults] = useState(0);
  const [bidHistory, setBidHistory] = useState<TBidHisotry[]>([]);
  const [isBidComingSoonMsgFlg, setBidComingSoonMsg] = useState(false);
  const [isRakusatsuProcessingMsgFlg, setRakusatsuProcessingMsgFlg] = useState(false);
  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const [nextLotList, setNextLotList] = useState<NextLotList[]>([]);
  const [msg, setMsg] = useState<string | null>();
  const [marqueeKey, setMarqueeKey] = useState(0);
  const [showBidEndPopup, setShowBidEndPopup] = useState(false);
  const [bidEndData, setBidEndData] = useState<any>(null);

  const ws = useRef<WebSocket | null>(null);
  const { texts } = useLocale();
  const { fetchSystemSettingData, systemSearchAPI } = useSystemSearchAPI();
  const { fetchAuction } = useCheckLiveAuctionAPI();
  const [fetchLiveAuctionStatus, setFetchLiveAuctionStatus] = useState<number>(0);
  const {
    responseStatus: searchPaddleNoResponseStatus,
    fetchPaddleNo,
    searchPaddleNoAPI,
  } = useSearchPaddleNoAPI();
  useEffect(() => {
    if (fetchAuction?.auctionSeq !== undefined) {
      setFetchLiveAuctionStatus(0);
      searchPaddleNoAPI(fetchAuction.auctionSeq);
    } else {
      setFetchLiveAuctionStatus(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAuction]);
  useEffect(() => {
    if (fetchAuction?.auctionSeq !== undefined) {
      searchPaddleNoAPI(fetchAuction?.auctionSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAuction?.auctionSeq]);
  useEffect(() => {
    console.log("fetchLiveAuctionStatus", fetchLiveAuctionStatus);
    console.log("fetchAuction", fetchAuction);
    console.log("fetchPaddleNo", fetchPaddleNo);
    if (fetchLiveAuctionStatus === 0 && fetchAuction?.auctionSeq !== undefined) {
      if (fetchPaddleNo !== "") {
        setFetchLiveAuctionStatus(3);
      } else {
        setFetchLiveAuctionStatus(2);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPaddleNo, fetchAuction]);

  useEffect(() => {
    if (fetchLiveAuctionStatus === 3) {
      systemSearchAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLiveAuctionStatus]);

  useEffect(() => {
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_LIVE_URL}`);

    const loginUserId = PageProps.userId;
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      //↓↓毎回取得
      setNextLotList(data.nextLotList);
      setBidHistory(data.liveBidLog);

      if (
        data.type === "set" ||
        data.type === "start" ||
        data.type === "updatePrice" ||
        data.type === "isBidDisabled" ||
        data.type === "clear"
      ) {
        setReceivedData(data);
        setBidStatus(fetchPaddleNo === data.kenriPaddleNo ? 1 : data.isBelowSaiteiPriceFlg ? 5 : 0);
      }
      if (data.type === "set") {
        setIsBidDisabled(true);
        setShowBidEndPopup(false);
        setBidEndData(null);
      }
      if (data.type === "start") {
        setIsBidDisabled(false);
      }
      if (data.type === "isBidDisabled") {
        setIsBidDisabled(true);
      }
      if (data.type === "updatePrice") {
        setIsBidDisabled(fetchPaddleNo === data.kenriPaddleNo);
        setIsPriceUpdated(true);
        setTimeout(() => setIsPriceUpdated(false), 1000);
      }
      if (data.type === "bidComingSoon") {
        setBidComingSoonMsg(true);
      } else {
        if (data.type === "sendMessage") {
          //メッセージ配信時は「もうすぐ落札」を表示したままにする
        } else {
          setBidComingSoonMsg(false);
        }
      }
      if (data.type === "rakusatsuProcessing") {
        setRakusatsuProcessingMsgFlg(true);
        setIsBidDisabled(true);
      } else {
        setRakusatsuProcessingMsgFlg(false);
      }
      if (data.type === "bidRestart") {
        setIsBidDisabled(fetchPaddleNo === data.kenriPaddleNo);
      }
      if (data.type === "bidEnd") {
        setIsBidDisabled(true);
        setBidResults(
          !data.kenriPaddleNo ? 4 : String(fetchPaddleNo) === String(data.kenriPaddleNo) ? 2 : 3
        );
        setShowBidEndPopup(true);
        setBidEndData(data);
      }
      if (data.type === "clear") {
        setIsBidDisabled(true);
      }
      if (data.type === "sendMessage") {
        setMsg(data.message);
        setMarqueeKey((k) => k + 1);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPaddleNo]);

  const handleViewOnlyCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewOnlyChecked(event.target.checked);
  };

  const getCommonData = () => ({
    userId: PageProps.userId,
    paddleNo: fetchPaddleNo,
  });
  const sendWebSocketMessage = (type: string, additionalData: Record<string, any> = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
        type,
        ...getCommonData(),
        ...additionalData,
      };
      ws.current.send(JSON.stringify(message));
    }
  };

  // 入札用関数
  const bid = async () => {
    const currentTime = new Date().toISOString();
    sendWebSocketMessage("onlineBid", {
      bidPrice: receivedData?.nextPrice,
      timestamp: currentTime,
    });
    setIsBidDisabled(true);
  };

  const [showVideo, setShowVideo] = useState(false);
  const toggleVideo = () => {
    setShowVideo((prev) => !prev);
  };
  const isMobile = useIsMobile();

  const closeBidEndPopup = () => {
    setShowBidEndPopup(false);
    setBidEndData(null);
  };

  // fetchLiveAuctionStatusに応じて表示を制御
  if (fetchLiveAuctionStatus === 0) {
    return null; // 何も表示しない
  }

  if (fetchLiveAuctionStatus === 1) {
    //オークション当日ではない
    return <NoLiveAuctionComponent texts={texts} />;
  }
  if (fetchLiveAuctionStatus === 2) {
    //オークション当日だがパドルがない
    return <NoPaddleAuctionComponent texts={texts} />;
  }

  if (fetchLiveAuctionStatus === 3) {
    return (
      <>
        <div className={memberStyles.memberContainer}>
          <div className={styles.liveContainer}>
            <NextLotListComponent
              nextLotList={nextLotList}
              receivedData={receivedData}
              userId={PageProps.userId}
            />
            <div className={styles.rightSection}>
              <div className={styles.mediaContainer}>
                {isMobile ? (
                  // スマホ時：ボタンに応じて表示切り替え
                  showVideo ? (
                    fetchSystemSettingData?.youtubeIframe && (
                      <div
                        className={styles.youtubeWrapper}
                        dangerouslySetInnerHTML={{
                          __html: fetchSystemSettingData.youtubeIframe,
                        }}
                        style={{ margin: "0 auto" }}
                      />
                    )
                  ) : (
                    <Image
                      src={receivedData?.goodsImage || "/no_image.png"}
                      alt=""
                      width={320}
                      height={320}
                      loading="lazy"
                      style={{ margin: "0 auto" }}
                    />
                  )
                ) : (
                  // PC時：ボタンに応じて動画のみ表示/非表示を切り替える
                  <div
                    style={{
                      display: "flex",
                      justifyContent: !showVideo ? "center" : "flex-start",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    {/* 画像は常に表示 */}
                    <Image
                      src={receivedData?.goodsImage || "/no_image.png"}
                      alt=""
                      width={320}
                      height={320}
                      loading="lazy"
                    />

                    {/* showVideo の状態に応じて iframe 表示 */}
                    {showVideo && fetchSystemSettingData?.youtubeIframe && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: fetchSystemSettingData.youtubeIframe,
                        }}
                      />
                    )}
                  </div>
                )}

                {/* 動画切り替えボタン - 右下に配置 */}
                <div className={styles.videoToggleButton}>
                  {showVideo ? (
                    <VideocamOffIcon
                      style={{ cursor: "pointer" }}
                      fontSize="large"
                      onClick={toggleVideo}
                    />
                  ) : (
                    <VideocamIcon
                      style={{ cursor: "pointer" }}
                      fontSize="large"
                      onClick={toggleVideo}
                    />
                  )}
                </div>
              </div>

              {/* 右側：2等分グリッドレイアウト */}
              <div className={styles.gridContainer}>
                {/* 上段：商品情報と入札履歴 */}
                <div className={styles.upperSection}>
                  <div className={styles.goodsInfoSection}>
                    <div className={styles.lot}>
                      <label>LOT {receivedData?.lot}</label>
                    </div>
                    <div className={styles.goodsName}>
                      <label>{receivedData?.goodsName}</label>
                    </div>
                  </div>
                </div>

                {/* 下段：メッセージと入札セクション */}
                <div className={styles.lowerSection}>
                  <div className={styles.bidHistorySection}>
                    <ul className={styles.bidList}>
                      {bidHistory?.map((bid, index) => (
                        <li key={index} className={styles.bidItem}>
                          {bid.userId === PageProps.userId?.toString() && (
                            <span className={styles.bidUserId}>your bid</span>
                          )}
                          {bid.userId !== "" && bid.userId !== PageProps.userId?.toString() && (
                            <span>オンライン</span>
                          )}
                          {bid.userId === "" && <span className={styles.kaijoBid}>会場</span>}
                          <span
                            className={
                              bid.userId === PageProps.userId?.toString()
                                ? styles.bidPriceYourBid
                                : styles.bidPrice
                            }
                          >
                            {formatPriceWithCommas(bid.bidPrice)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.bidSectionContainer}>
                    <div className={styles.priceContainer}>
                      <div className={styles.msgDiv}>
                        {isBidComingSoonMsgFlg && <span>{texts.button.BidComingSoon}</span>}
                        {isRakusatsuProcessingMsgFlg && (
                          <span>{texts.livemessage.rakusatsuProcessMsg}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.bidSection}>
                      <div className={styles.priceContainer}>
                        <div className={styles.priceInfo}>
                          <span className={styles.currentPriceLabel}>
                            {texts.goods.currentPrice}
                          </span>
                          <label
                            className={`${styles.currentPrice} ${
                              isPriceUpdated ? styles.priceUpdated : ""
                            }`}
                          >
                            {receivedData?.currentPrice != null && (
                              <label>
                                {new Intl.NumberFormat("ja-JP", {
                                  style: "currency",
                                  currency: "JPY",
                                }).format(receivedData.currentPrice)}
                              </label>
                            )}
                          </label>
                        </div>
                        <LiveBidStatusComponent bidStatus={bidStatus} texts={texts.live} />
                        <div className={styles.priceInfo}>
                          <div className={styles.checkboxContainer}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={viewOnlyChecked}
                                  onChange={handleViewOnlyCheckboxChange}
                                  sx={{
                                    color: "gray",
                                    "&.Mui-checked": {
                                      color: "#cb5201",
                                    },
                                    width: 40,
                                    height: 40,
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 32,
                                    },
                                  }}
                                />
                              }
                              label="View Only"
                            />
                          </div>
                          {!viewOnlyChecked && (
                            <LiveBidButton
                              onClick={bid}
                              disabled={isBidDisabled}
                              text={
                                receivedData?.nextPrice != null
                                  ? new Intl.NumberFormat("ja-JP", {
                                      style: "currency",
                                      currency: "JPY",
                                    }).format(receivedData.nextPrice)
                                  : ""
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.flowingMsgDiv}>
                  <span key={marqueeKey} className={styles.marquee}>
                    {msg}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bidEndポップアップ */}
        {showBidEndPopup && bidEndData && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <div className={styles.popupHeader}>
                <button className={styles.closeButton} onClick={closeBidEndPopup}>
                  ×
                </button>
              </div>
              <div className={styles.popupBody}>
                {bidResults === 2 && (
                  <p className={styles.winnerMessage}>{texts.live.bidStatus2}</p>
                )}
                {bidResults === 3 && <p className={styles.loserMessage}>{texts.live.bidStatus3}</p>}
                {bidResults === 4 && <p className={styles.loserMessage}>{texts.live.bidStatus4}</p>}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // デフォルトケース（fetchLiveAuctionStatusが0の場合）
  return null;
};

export default withMemberLayout(Page);
