import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
import GavelIcon from "@mui/icons-material/Gavel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Favorite from "@mui/icons-material/Favorite";
//コンポーネント
import AuctionStatusComponent from "@/components/member/auction/internetTender/AuctionStatusComponent";
import FavoriteToggleComponent from "@/components/member/goods/FavoriteToggleComponent";
import BidModal from "@/components/member/auction/internetTender/BidModalComponent";
import LiveJizenBidModal from "@/components/member/auction/live/LiveJizenBidModalComponent";
import RemainingTime from "@/components/member/auction/internetTender/RemainingTimeComponent";
import ConfirmDialog from "@/components/ui/dialog/confirmDialog";
//API
import { useLiveJizenBidDeleteAPI } from "@/hooks/api/member/goods/useLiveJizenBidDeleteAPI";
//型定義
import { TGoodsSelect } from "@/types/common/goods";
//スタイル
import styles from "@/styles/member/goods/GoodsList.module.css";
import ButtonStyles from "@/styles/Button.module.css";
interface Props {
  data: TGoodsSelect;
  isLogin: boolean;
  loginUserId: number;
  canBid: boolean;
  texts: any;
}

const GoodsCardComponent: React.FC<Props> = ({ data, isLogin, loginUserId, canBid, texts }) => {
  const [goodsInfo, setGoodsInfo] = useState(data);
  useEffect(() => {
    setGoodsInfo(data);
  }, [data]);

  const handleClick = (goodsId: number) => {
    let goodsUrl = "";
    if (isLogin) {
      goodsUrl = `/member/goods/detail?goodsId=${goodsId}`;
    } else {
      goodsUrl = `/goods/detail?goodsId=${goodsId}`;
    }
    window.open(goodsUrl, "_blank");
  };

  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const handleBidToggleModal = () => {
    setBidModalOpen(!isBidModalOpen);
  };
  const [isJizenBidModalOpen, setJizenBidModalOpen] = useState(false);
  const handleJizenToggleModal = () => {
    setJizenBidModalOpen(!isJizenBidModalOpen);
  };

  const { liveJizenBidDeleteAPI } = useLiveJizenBidDeleteAPI();
  const handleJizenBidDelete = (goodsId: number) => {
    liveJizenBidDeleteAPI(goodsId);
  };

  const handleFavoriteToggle = (isFavorite: boolean) => {
    setGoodsInfo(prev => ({
      ...prev,
      favoriteCount: isFavorite ? prev.favoriteCount + 1 : prev.favoriteCount - 1
    }));
  };
  return (
    <div
      className={`${styles.goodsCard} ${goodsInfo.spnKbn === "1" ? styles.cardHeightSmall : ""}`}
    >
      <div className={styles.GoodsPointer} onClick={() => handleClick(goodsInfo.goodsId)}>
        <div className={styles.imageWrapper}>
          <Image
            src={goodsInfo.squareImageUrl ?? "/no_image.png"}
            alt=""
            fill
            priority
            sizes="(max-width: 600px) 100vw, 50vw"
            className={styles.goodsImage}
          />
          {goodsInfo.chumokuFlg && (
            <div className={`${styles.badge} ${styles.chumokuBadge}`}>{texts.goods.chumokuFlg}</div>
          )}
          {loginUserId === Number(goodsInfo.shuppinUserId) && (
            <div className={`${styles.badge} ${styles.mySpnBadge}`}>{texts.label.mySpn}</div>
          )}
          <AuctionStatusComponent
            auctionTimeStatus={goodsInfo.auctionTimeStatus}
            currentKenriUserId={goodsInfo.currentKenriUserId}
            loginUserId={loginUserId}
            texts={texts.goods}
            bidPrice={goodsInfo.bidPrice}
            saiteiRakusatsuPriceOverFlg={goodsInfo.saiteiRakusatsuPriceOverFlg}
            isDetail={false}
          />
        </div>
        <div className={styles.lotContainer}>
          <h2 className={styles.lot}>LOT {goodsInfo.lot}</h2>
          {isLogin && (
            <FavoriteToggleComponent
              goodsId={goodsInfo.goodsId}
              initialFavoriteState={goodsInfo.myFavoriteFlg}
              onFavoriteToggle={handleFavoriteToggle}
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </div>

        <h2 className={styles.goodsName}>{goodsInfo.goodsName}</h2>
        <p className={styles.goodsSetsumei}>{goodsInfo.goodsSetsumei}</p>

        <p className={styles.goodsRowInfo}>
          {goodsInfo.spnKbn != "3" ? (
            <span>{texts.goods.startPrice}</span>
          ) : (
            <span>{texts.goods.currentPrice}</span>
          )}
          <span
            className={`${styles.currentPrice} ${data.isPriceUpdated ? styles.priceUpdated : ""}`}
          >
            <CurrencyYenIcon />
            {goodsInfo.startCurrentPrice}
          </span>
        </p>
        {goodsInfo.spnKbn !== "1" ? (
          <p className={styles.goodsRowInfo}>
            {goodsInfo.spnKbn == "2" ? (
              <span>{texts.goods.jizenBidPrice}</span>
            ) : (
              <span>{texts.goods.bidPrice}</span>
            )}

            {goodsInfo.bidPrice != "" ? (
              <span className={styles.bidPrice}>
                <CurrencyYenIcon />
                {goodsInfo.bidPrice}
              </span>
            ) : (
              <span></span>
            )}
          </p>
        ) : (
          <></>
        )}

        {(goodsInfo.spnKbn === "3" || goodsInfo.spnKbn === "4") && (
          <div className={styles.goodsRowInfo}>
            <div className="flex items-center gap-1">
              <Favorite className="text-gray-500" />
              <span className={`${styles.bidCount}`}>{goodsInfo.favoriteCount}</span>
            </div>
            <div className="flex items-center gap-1">
              {goodsInfo.spnKbn === "3" && goodsInfo.bidCount && (
                <>
                  <GavelIcon className="text-gray-500" />
                  <span
                    className={`${styles.bidCount} ${
                      data.isPriceUpdated ? styles.priceUpdated : ""
                    }`}
                  >
                    {goodsInfo.bidCount}
                  </span>
                </>
              )}
            </div>
            {goodsInfo.remainingTime && (
              <div className="flex items-center gap-1">
                <AccessTimeIcon className="text-gray-500" />
                <span className={styles.remainingTime}>
                  <RemainingTime initialTime={goodsInfo.remainingTime} />
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {isLogin &&
        canBid &&
        loginUserId !== Number(goodsInfo.shuppinUserId) &&
        goodsInfo.auctionTimeStatus === 2 &&
        goodsInfo.spnKbn !== "1" && (
          <>
            <button
              onClick={goodsInfo.spnKbn === "2" ? handleJizenToggleModal : handleBidToggleModal}
              className={ButtonStyles.bidButton}
            >
              <GavelIcon className="text-white" />
              {
                texts.button[
                  goodsInfo.spnKbn === "1" || goodsInfo.spnKbn === "2"
                    ? "jizenBidToggle"
                    : "bidToggle"
                ]
              }
            </button>

            {goodsInfo.bidPrice != "" && (goodsInfo.spnKbn === "1" || goodsInfo.spnKbn === "2") && (
              <ConfirmDialog
                title={texts.message.confirmDelete}
                description=""
                buttonTitle={texts.button.delete}
                className={ButtonStyles.jizenBidDeleteButton}
                dialogClassName="bg-red-500 hover:bg-opacity-50 text-white font-bold py-4 px-4 w-40"
                dialogCancelClassName="bg-white hover:bg-opacity-50 border border-solid border-red-500 text-red-500 py-4 px-4 w-40 float-left"
                onSubmit={() => handleJizenBidDelete(goodsInfo.goodsId)}
                buttonText={texts.button.deleteJizenBidToggle}
              />
            )}
          </>
        )}

      <BidModal
        isOpen={isBidModalOpen}
        toggleFilter={handleBidToggleModal}
        lot={goodsInfo.lot}
        goodsName={goodsInfo.goodsName}
        bidSpnkbn={goodsInfo.spnKbn}
        bidGoodsId={goodsInfo.goodsId}
        bidPrice={goodsInfo.nextBidPrice || goodsInfo.startCurrentPrice.toString()}
        bidUnit={goodsInfo.bidUnit.toString()}
      />

      <LiveJizenBidModal
        isOpen={isJizenBidModalOpen}
        toggleFilter={handleJizenToggleModal}
        lot={goodsInfo.lot}
        goodsName={goodsInfo.goodsName}
        bidGoodsId={goodsInfo.goodsId}
        bidPrice={goodsInfo.bidPrice !== "" ? goodsInfo.bidPrice : goodsInfo.startPrice.toString()}
        startPrice={goodsInfo.startPrice.toString()}
        bidUnit={goodsInfo.bidUnit.toString()}
      />
    </div>
  );
};

export default GoodsCardComponent;
