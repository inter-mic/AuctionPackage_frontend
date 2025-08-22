import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";
//型定義
import { TMarketSelect } from "@/types/member/market";
//スタイル
import styles from "@/styles/member/goods/GoodsList.module.css";
interface Props {
  data: TMarketSelect;
  texts: any;
}

const MarketCardComponent: React.FC<Props> = ({ data, texts }) => {
  const [goodsInfo, setGoodsInfo] = useState(data);
  useEffect(() => {
    setGoodsInfo(data);
  }, [data]);

  const handleClick = (goodsId: number) => {
    const goodsUrl = `/member/goods/detail?goodsId=${goodsId}`;
    window.open(goodsUrl, "_blank");
  };

  return (
    <div className={`${styles.goodsCard}`}>
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
        </div>
        <div className={styles.lotContainer}>
          <h2 className={styles.lot}>LOT {goodsInfo.lot}</h2>
        </div>

        <h2 className={styles.goodsName}>{goodsInfo.goodsName}</h2>
        <p className={styles.goodsSetsumei}>{goodsInfo.goodsSetsumei}</p>

        <p className={styles.goodsRowInfo}>
          <span>{texts.goods.rakusattsuPrice}</span>
          <span className={`${styles.currentPrice}`}>
            <CurrencyYenIcon />
            {goodsInfo.rakusatsuPricePrice}
          </span>
        </p>
        <p className={styles.goodsRowInfo}>
          <span>{texts.auction.auctionData}</span>
          <span className={`${styles.currentPrice}`}>{goodsInfo.auctionDatetime}</span>
        </p>
        <p className={styles.goodsRowInfo}>
          <span>{texts.auction.auctionName}</span>
          <span className={`${styles.currentPrice}`}>{goodsInfo.auctionName}</span>
        </p>
      </div>
    </div>
  );
};

export default MarketCardComponent;
