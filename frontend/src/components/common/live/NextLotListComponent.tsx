import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { NextLotList } from "@/types/common/nextLotList";
import styles from "@/styles/NextLotListComponent.module.css";

interface NextLotListComponentProps {
  nextLotList: NextLotList[];
  receivedData: any;
  userId: string | number | null;
  screenType?: "auctioneer" | "bid"; // 画面の種類を指定
}

const NextLotListComponent: React.FC<NextLotListComponentProps> = ({
  nextLotList,
  receivedData,
  userId,
  screenType = "bid", // デフォルトはbid
}) => {
  const nextLotListContainerRef = useRef<HTMLDivElement>(null);

  // 現在のlotの位置までスクロールする関数
  const scrollToCurrentLot = useCallback((currentLot: string) => {
    if (!nextLotListContainerRef.current || !nextLotList.length) return;

    const container = nextLotListContainerRef.current;
    const lotCards = container.querySelectorAll(`[data-lot]`);

    lotCards.forEach((card) => {
      const lotValue = card.getAttribute("data-lot");
      if (lotValue === currentLot) {
        const cardElement = card as HTMLElement;
        const cardTop = cardElement.offsetTop;
        const containerHeight = container.clientHeight;
        const cardHeight = cardElement.clientHeight;

        // 画面の種類に応じてスクロール位置を調整
        let scrollTop;
        if (screenType === "auctioneer") {
          // auctioneer画面：bottomLeftの高さを考慮して上部に配置
          // bottomLeftは50%の高さなので、その範囲内でスクロール
          scrollTop = Math.max(0, cardTop - 500); // 上部に少し余白を設ける
        } else {
          // bid画面：コンテナの中央に配置
          scrollTop = cardTop - containerHeight / 2 + cardHeight / 2;
        }

        // コンテナ内でスムーズにスクロール
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: "smooth",
        });

        // ハイライト効果を追加
        card.classList.add("highlight");
        setTimeout(() => {
          card.classList.remove("highlight");
        }, 2000);
      }
    });
  }, [nextLotList?.length, screenType]);

  // receivedDataが更新されたときにスクロール
  React.useEffect(() => {
    if (receivedData?.lot && nextLotList?.length > 0) {
      setTimeout(() => {
        scrollToCurrentLot(receivedData.lot);
      }, 100);
    }
  }, [receivedData?.lot, nextLotList, screenType, scrollToCurrentLot]);

  return (
    <div
      className={`${styles.leftSection} ${
        screenType === "auctioneer" ? styles.auctioneerLeftSection : ""
      }`}
    >
      <div
        ref={nextLotListContainerRef}
        className={`${styles.leftNextLotListContainer} ${
          screenType === "auctioneer" ? styles.auctioneerNextLotListContainer : ""
        }`}
      >
        {nextLotList?.length > 1 ? (
          nextLotList.slice(0).map((item: NextLotList, idx: number) => (
            <div
              key={idx}
              className={`${styles.leftNextLotCard} ${
                receivedData?.lot === item.lot ? styles.currentLotCard : ""
              }`}
              data-lot={item.lot}
            >
              <div className={styles.leftNextLotImageWrapper}>
                <Image
                  src={item.thumbnailImageUrl || "/no_image.png"}
                  alt={item.goodsName || ""}
                  fill
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <div className={styles.leftNextLotCaption}>
                <div className={styles.leftNextLotLot}>
                  LOT {item.lot}
                  {userId?.toString() === item.rakusatsuUserId && (
                    <span className={styles.rakusatsuLabel}>落札</span>
                  )}
                </div>
                <div className={styles.leftNextLotName}>{item.goodsName}</div>
                <div className={styles.leftNextLotPrice}>
                  {item.startPrice ||
                    new Intl.NumberFormat("ja-JP").format(Number(item.startPrice))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NextLotListComponent;
