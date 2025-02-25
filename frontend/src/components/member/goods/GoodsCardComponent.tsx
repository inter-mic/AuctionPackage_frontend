import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import GavelIcon from '@mui/icons-material/Gavel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
//コンポーネント
import AuctionStatusComponent from '@/components/member/goods/AuctionStatusComponent';
import FavoriteToggleComponent from '@/components/member/goods/FavoriteToggleComponent';
import BidModal from '@/components/member/auction/internetTender/BidModalComponent';
import RemainingTime from '@/components/member/auction/internetTender/RemainingTimeComponent';
//型定義
import { TGoodsSelect } from '@/types/common/goods';
//スタイル
import styles from '@/styles/member/goods/GoodsList.module.css';
import ButtonStyles from '@/styles/Button.module.css';
interface Props {
  data: TGoodsSelect;
  isLogin: boolean;
  loginUserId: number;
  texts: any;
}

const GoodsCardComponent: React.FC<Props> = ({ data, isLogin, loginUserId, texts }) => {
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

  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  return (
    <div className={styles.goodsCard} >
      <div className={styles.GoodsPointer} onClick={() => handleClick(goodsInfo.goodsId)}>
        <div className={styles.imageWrapper} >
          <Image
            src={goodsInfo.squareImageUrl ?? "/no_image.png"}
            alt=""
            fill
            priority
            sizes="(max-width: 600px) 100vw, 50vw"
            className={styles.goodsImage}
          />
          {goodsInfo.chumokuFlg && <div className={styles.chumokuBadge}>{texts.goods.chumokuFlg}</div>}
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
          {isLogin && <FavoriteToggleComponent goodsId={goodsInfo.goodsId} initialFavoriteState={goodsInfo.myFavoriteFlg} onClick={(event) => event.stopPropagation()} />}
        </div>

        <h2 className={styles.goodsName}>{goodsInfo.goodsName}</h2>
        <p className={styles.goodsSetsumei}>{goodsInfo.goodsSetsumei}</p>

        <p className={styles.goodsRowInfo}>
          {goodsInfo.spnKbn == "4" ? (
            <span>{texts.goods.startPrice}</span>
          ) : (
            <span>{texts.goods.currentPrice}</span>
          )}
          <span className={`${styles.currentPrice} ${data.isPriceUpdated ? styles.priceUpdated : ""}`}><CurrencyYenIcon />{goodsInfo.startCurrentPrice}</span>
        </p>
        <p className={styles.goodsRowInfo}>
          <span>{texts.goods.bidPrice}</span>
          {goodsInfo.bidPrice != "" ? (
            <span className={styles.bidPrice}><CurrencyYenIcon />{goodsInfo.bidPrice}</span>
          ) : (
            <span></span>
          )}
        </p>

        <div className={styles.goodsRowInfo}>
          <div className="flex items-center gap-1">
            {goodsInfo.spnKbn == "4" ? (
              <div></div>
            ) : (
              goodsInfo.bidCount ? (
                <>
                  <GavelIcon className="text-gray-500" />
                  <span className={`${styles.bidCount} ${data.isPriceUpdated ? styles.priceUpdated : ""}`}>
                    {goodsInfo.bidCount} {texts.label.resultCount}
                  </span>
                </>
              ) : null
            )}
          </div>
          {goodsInfo.remainingTime && (
            <div className="flex items-center gap-1">
              <AccessTimeIcon className="text-gray-500" />
              <span className={styles.remainingTime}><RemainingTime initialTime={goodsInfo.remainingTime} /></span>
            </div>
          )}
        </div>

      </div>


      {isLogin && goodsInfo.auctionTimeStatus === 2 && (
        <button
          onClick={toggleModal}
          className={ButtonStyles.bidButton}
        >
          <GavelIcon className="text-white" />
          {texts.button.bitToggle}
        </button>
      )}

      <BidModal
        isOpen={isModalOpen}
        toggleFilter={toggleModal}
        lot={goodsInfo.lot}
        goodsName={goodsInfo.goodsName}
        bidSpnkbn={goodsInfo.spnKbn}
        bidGoodsId={goodsInfo.goodsId}
        bidPrice={goodsInfo.nextBidPrice || goodsInfo.startCurrentPrice.toString()}
        bidUnit={goodsInfo.bidUnit.toString()}
      />
    </div>
  );
};

export default GoodsCardComponent;
