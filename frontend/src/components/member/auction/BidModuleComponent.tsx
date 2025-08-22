import React from "react";
import { useRef } from "react";
import "react-medium-image-zoom/dist/styles.css";
import { toast } from "react-toastify";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useAuctionWebSocket } from "@/hooks/useAuctionWebSocket";
//ボタン
import { PleaseLoginButton } from "@/components/ui/buttons/member/pleaseLoginButton";
//コンポーネント
import AuctionStatusComponent from "@/components/member/auction/internetTender/AuctionStatusComponent";
import BidModalComponent from "@/components/member/auction/internetTender/BidModalComponent";
import LiveJizenBidModalComponent from "@/components/member/auction/live/LiveJizenBidModalComponent";
import RemainingTimeComponent from "@/components/member/auction/internetTender/RemainingTimeComponent";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//API
import { useLiveJizenBidDeleteAPI } from "@/hooks/api/member/goods/useLiveJizenBidDeleteAPI";
//アイコン
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GavelIcon from "@mui/icons-material/Gavel";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import Favorite from "@mui/icons-material/Favorite";
//型定義
import { TGoodsSelect } from "@/types/common/goods";
import { TAuctionWebSocketData } from "@/types/member/AuctionWebSocket";
//スタイル
import ButtonStyles from "@/styles/Button.module.css";
import styles from "@/styles/member/auction/internetTender/Bid.module.css";

interface Props {
  isLogin: boolean;
  canBid: boolean;
  loginUserId: number;
  fetchGoodsData: TGoodsSelect | undefined;
}
const BidModuleComponent: React.FC<Props> = ({ fetchGoodsData, isLogin, loginUserId, canBid }) => {
  const { useState, useEffect, useCallback, texts } = useCommonSetup();

  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const handleBidToggleModal = () => {
    setBidModalOpen(!isBidModalOpen);
  };
  const [isJizenBidModalOpen, setJizenBidModalOpen] = useState(false);
  const handleJizenToggleModal = () => {
    setJizenBidModalOpen(!isJizenBidModalOpen);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!isLoaded && document.readyState === "complete") {
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGoodsDataRef = useRef(fetchGoodsData);
  useEffect(() => {
    fetchGoodsDataRef.current = fetchGoodsData;
  }, [fetchGoodsData]);

  const [bidState, setBidState] = useState({
    remainingTime: fetchGoodsData?.remainingTime ?? "",
    startCurrentPrice: fetchGoodsData?.startCurrentPrice ?? "",
    currentKenriUserId: fetchGoodsData?.currentKenriUserId ?? 0,
    auctionTimeStatus: fetchGoodsData?.auctionTimeStatus ?? 0,
    bidCount: fetchGoodsData?.bidCount ?? "",
    favoriteCount: fetchGoodsData?.favoriteCount ?? "",
    bidPrice: fetchGoodsData?.bidPrice ?? "",
    nextBidPrice: fetchGoodsData?.nextBidPrice ?? "",
    saiteiRakusatsuPriceOverFlg: fetchGoodsData?.saiteiRakusatsuPriceOverFlg ?? false,
  });
  useEffect(() => {
    if (!fetchGoodsData) return;
    setBidState((prev) => ({
      ...prev,
      remainingTime: fetchGoodsData.remainingTime ?? prev.remainingTime,
      startCurrentPrice: fetchGoodsData.startCurrentPrice ?? prev.startCurrentPrice,
      currentKenriUserId: fetchGoodsData.currentKenriUserId ?? prev.currentKenriUserId,
      auctionTimeStatus: fetchGoodsData.auctionTimeStatus ?? prev.auctionTimeStatus,
      bidCount: fetchGoodsData.bidCount ?? prev.bidCount,
      bidPrice: fetchGoodsData.bidPrice ?? prev.bidPrice,
      nextBidPrice: fetchGoodsData.nextBidPrice ?? prev.nextBidPrice,
      saiteiRakusatsuPriceOverFlg:
        fetchGoodsData.saiteiRakusatsuPriceOverFlg ?? prev.saiteiRakusatsuPriceOverFlg,
    }));
  }, [fetchGoodsData]);

  const [isPriceUpdated, setIsPriceUpdated] = useState(false);
  const updateGoodsDataApp = useCallback(
    (data: TAuctionWebSocketData) => {
      const currentGoodsData = fetchGoodsDataRef.current;
      if (!currentGoodsData) return;
      if (data.goodsId === currentGoodsData.goodsId) {
        setBidState((prev) => {
          const currentPrice = Number(
            data.startCurrentPrice ? data.startCurrentPrice.replace(/,/g, "") : 0
          );
          const bidPrice = Number(currentGoodsData?.bidPrice?.replace(/,/g, "") || 0);
          const bidUnit = Number(currentGoodsData?.bidUnit?.replace(/,/g, "") || 0);

          let nextPrice = prev.nextBidPrice;
          if (currentPrice > bidPrice) {
            nextPrice = (currentPrice + bidUnit).toLocaleString();
          } else {
            nextPrice = (bidPrice + bidUnit).toLocaleString();
          }

          return {
            ...prev,
            remainingTime: data.remainingTime,
            startCurrentPrice: data.startCurrentPrice,
            currentKenriUserId: data.currentKenriUserId,
            auctionTimeStatus: data.auctionTimeStatus,
            bidCount: data.bidCount,
            bidPrice: data.bidUserId === loginUserId ? data.bidPrice : prev.bidPrice,
            nextBidPrice: data.bidUserId === loginUserId ? data.nextBidPrice : nextPrice,
            saiteiRakusatsuPriceOverFlg: data.saiteiRakusatsuPriceOverFlg,
          };
        });

        setIsPriceUpdated(true);
        setTimeout(() => setIsPriceUpdated(false), 1000);

        if (data.auctionBidFlg && data.bidUserId == loginUserId) {
          if (data.currentKenriUserId == loginUserId) {
            toast.success(texts.message.highestBid);
          } else {
            toast.warning(texts.message.noHighestBid);
          }
        }
        if (!data.auctionBidFlg && data.bidUserId == loginUserId) {
          toast.success(texts.message.registBid);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchGoodsData]
  );

  const updateGoodsDataBatch = useCallback(
    (data: TAuctionWebSocketData) => {
      const currentGoodsData = fetchGoodsDataRef.current;
      if (!currentGoodsData) return;
      if (data.goodsId === currentGoodsData.goodsId) {
        setBidState((prev) => ({
          ...prev,
          remainingTime: data.remainingTime,
          auctionTimeStatus: data.auctionTimeStatus,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchGoodsData]
  );

  useAuctionWebSocket(updateGoodsDataApp, updateGoodsDataBatch, isLoaded);

  const { liveJizenBidDeleteAPI } = useLiveJizenBidDeleteAPI();
  const handleJizenBidDelete = (goodsId: number) => {
    liveJizenBidDeleteAPI(goodsId);
  };

  return (
    <div>
      <div className={styles.priceContainer}>
        <div className={`${styles.goodsPrice} ${bidState.bidPrice !== "" ? styles.bidPrice : ""}`}>
          {fetchGoodsData?.spnKbn != "3" ? (
            <p className={styles.priceRow}>
              <span className={styles.priceLabel}>{texts.goods.startPrice}</span>
              <span className={styles.currentPrice}>
                <CurrencyYenIcon />
                {fetchGoodsData?.startPrice}
              </span>
            </p>
          ) : (
            <p className={styles.priceRow}>
              <span className={styles.priceLabel}>{texts.goods.currentPrice}</span>
              <span
                className={`${styles.currentPrice} ${isPriceUpdated ? styles.priceUpdated : ""}`}
              >
                <CurrencyYenIcon />
                {bidState.startCurrentPrice}
              </span>
            </p>
          )}
          {fetchGoodsData?.spnKbn != "1" && (
            <div className={styles.priceRow}>
              {bidState.bidPrice != null && bidState.bidPrice !== "" ? (
                <>
                  <span className={styles.priceLabel}>
                    {fetchGoodsData?.spnKbn == "2" ? (
                      <span>{texts.goods.jizenBidPrice}</span>
                    ) : (
                      <span>{texts.goods.bidPrice}</span>
                    )}
                  </span>
                  <span className={styles.bidPrice}>
                    <CurrencyYenIcon />
                    {bidState.bidPrice}
                  </span>
                </>
              ) : (
                <span></span>
              )}
            </div>
          )}
        </div>

        {!isLogin ? (
          <>
            <div className={styles.loginContainer}>
              <PleaseLoginButton />
            </div>
          </>
        ) : (
          <>
            {canBid && loginUserId === Number(fetchGoodsData?.shuppinUserId) && (
              <>
                {fetchGoodsData?.spnKbn == "1" || fetchGoodsData?.spnKbn == "2" ? (
                  <span></span>
                ) : (
                  <span className="md:h-14">
                    <AuctionStatusComponent
                      auctionTimeStatus={bidState.auctionTimeStatus ?? ""}
                      currentKenriUserId={
                        bidState.currentKenriUserId !== undefined ? bidState.currentKenriUserId : 0
                      }
                      loginUserId={loginUserId}
                      texts={texts.goods}
                      bidPrice={bidState.bidPrice ?? ""}
                      saiteiRakusatsuPriceOverFlg={bidState.saiteiRakusatsuPriceOverFlg ?? false}
                      isDetail={true}
                    />
                  </span>
                )}

                {fetchGoodsData?.spnKbn != "1" && bidState.auctionTimeStatus === 2 && (
                  <div>
                    <button
                      onClick={
                        fetchGoodsData?.spnKbn === "1" || fetchGoodsData?.spnKbn === "2"
                          ? handleJizenToggleModal
                          : handleBidToggleModal
                      }
                      className={`${ButtonStyles.bidButton} ${ButtonStyles.bidDetailButton}`}
                    >
                      <GavelIcon className="text-white" />
                      {
                        texts.button[
                          fetchGoodsData?.spnKbn === "1" || fetchGoodsData?.spnKbn === "2"
                            ? "jizenBidToggle"
                            : "bidToggle"
                        ]
                      }
                    </button>
                  </div>
                )}

                {fetchGoodsData?.spnKbn === "1" || fetchGoodsData?.spnKbn === "2" ? (
                  bidState.bidPrice !== "" && (
                    <div>
                      <ConfirmDialog
                        title={texts.message.confirmDelete}
                        description=""
                        buttonTitle={texts.button.delete}
                        className={`${ButtonStyles.jizenBidDeleteButton} ${ButtonStyles.jizenBidDeleteDetailButton}`}
                        dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 w-40"
                        dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 w-40 float-left"
                        onSubmit={() => handleJizenBidDelete(fetchGoodsData?.goodsId)}
                        buttonText={texts.button.deleteJizenBidToggle}
                      />
                    </div>
                  )
                ) : (
                  <span></span>
                )}

                <BidModalComponent
                  isOpen={isBidModalOpen}
                  toggleFilter={handleBidToggleModal}
                  lot={fetchGoodsData?.lot || ""}
                  goodsName={fetchGoodsData?.goodsName || ""}
                  bidSpnkbn={fetchGoodsData?.spnKbn || ""}
                  bidGoodsId={fetchGoodsData?.goodsId || 0}
                  bidPrice={bidState.nextBidPrice || fetchGoodsData?.startCurrentPrice || ""}
                  bidUnit={fetchGoodsData?.bidUnit || ""}
                />

                <LiveJizenBidModalComponent
                  isOpen={isJizenBidModalOpen}
                  toggleFilter={handleJizenToggleModal}
                  lot={fetchGoodsData?.lot || ""}
                  goodsName={fetchGoodsData?.goodsName || ""}
                  bidGoodsId={fetchGoodsData?.goodsId || 0}
                  bidPrice={bidState.bidPrice || fetchGoodsData?.startCurrentPrice || ""}
                  startPrice={fetchGoodsData?.startPrice || ""}
                  bidUnit={fetchGoodsData?.bidUnit || ""}
                />
              </>
            )}
          </>
        )}

        <div className={styles.goodsRowInfo}>
          <div className="flex items-center gap-1">
            <>
              <Favorite className="text-gray-500" />
              <span className={`${styles.bidCount}`}>
                {bidState.favoriteCount} {texts.label.resultCount}
              </span>
            </>
          </div>
          {(fetchGoodsData?.spnKbn === "3" || fetchGoodsData?.spnKbn === "4") && (
            <>
              <div className="flex items-center gap-1">
                {fetchGoodsData?.spnKbn == "4" ? (
                  <div></div>
                ) : (
                  <>
                    <GavelIcon className="text-gray-500" />
                    <span
                      className={`${styles.bidCount} ${isPriceUpdated ? styles.priceUpdated : ""}`}
                    >
                      {bidState.bidCount} {texts.label.resultCount}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <>
                  <AccessTimeIcon className="text-gray-500" />
                  <span className={styles.remainingTime}>
                    <RemainingTimeComponent initialTime={bidState.remainingTime || ""} />
                  </span>
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidModuleComponent;
