import React from "react";
import { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";
import { getTexts } from "@/config/texts";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useImageClickHandler } from "@/hooks/useImageClickHandler";
import { usePopupNavigation } from "@/hooks/usePopupNavigation";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//API
import { useMarketSearchByGoodsIdAPI } from "@/hooks/api/member/market/useMarketSearchByGoodsIdAPI";
import { useGoodsSearchImageAPI } from "@/hooks/api/common/useGoodsSearchImageAPI";
import { useGoodsAddinfoItemAPI } from "@/hooks/api/public/useGoodsAddinfoItemAPI";
//コンポーネント
import { ImageWrapperComponent } from "@/components/member/goods/ImageWrapperComponent";
import ImagePopupComponent from "@/components/member/goods/ImagePopupComponent";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TGoodsImageData } from "@/types/common/goodsImage";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/goods/GoodsDetail.module.css";
import CurrencyYenIcon from "@mui/icons-material/CurrencyYen";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberMarket,
    },
  };
});

const Page: React.FC<TPageProps> = () => {
  const { useEffect, useState, useRouter, texts } = useCommonSetup();
  const router = useRouter();
  const params = useSearchParams();
  const paramsGoodsId = params ? params.get("goodsId") : null;
  const { goodsAddInfo } = useGoodsAddinfoItemAPI();
  const { fetchImages, goodsSearchImage } = useGoodsSearchImageAPI();
  const { fetchGoodsData, marketSearchByGoodsIdAPI } = useMarketSearchByGoodsIdAPI();
  useEffect(() => {
    if (paramsGoodsId) {
      marketSearchByGoodsIdAPI(Number(paramsGoodsId));
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsGoodsId]);
  const [thumImages, setThumImages] = useState<TGoodsImageData[]>([]);
  const [mainImageSrc, setMainImageSrc] = useState("/no_image.png");

  useEffect(() => {
    if (fetchGoodsData) {
      if (fetchGoodsData.squareImageUrl) {
        setMainImageSrc(fetchGoodsData.squareImageUrl);
        goodsSearchImage(Number(paramsGoodsId), true);
      } else {
        setMainImageSrc("/no_image.png");
        setThumImages([]);
      }

      const { goodsName } = fetchGoodsData;
      document.title = `${texts.menu.memberGoodsDetail} | ${goodsName}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);

  useEffect(() => {
    if (fetchImages.length > 0) {
      setThumImages(fetchImages);
    } else {
      setThumImages([]);
    }
     
  }, [fetchImages]);

  const { popupOpen, popupIndex, handlePopupOpen, handlePrev, handleNext, handleClose } =
    usePopupNavigation({ thumImages });

  const { selectedImage, handleImageClick, handleMainImageClick } = useImageClickHandler({
    thumImages,
    mainImageSrc,
    setMainImageSrc,
    enablePopup: true,
    onPopupOpen: handlePopupOpen,
  });

  return (
    <>
      <div className={`${memberStyles.memberContainer} py-5`}>
        <ImageWrapperComponent
          mainImageSrc={mainImageSrc}
          thumImages={thumImages}
          selectedImage={selectedImage}
          onMainImageClick={handleMainImageClick}
          onThumbnailClick={handleImageClick}
        />
        <div className={styles.details}>
          <h2 className={`${styles.lotContainer}`}>
            <div className={styles.lotLeft}>
              <span className={styles.lotLabel}>
                {texts.goods.lot} {fetchGoodsData?.lot}
              </span>
            </div>
          </h2>
          <h2 className={styles.goodsName}>{fetchGoodsData?.goodsName}</h2>

          <div className={styles.rakusatsuPriceContainer}>
            <p className={styles.rakusatsuPriceRow}>
              <span className={styles.priceLabel}>{texts.goods.rakusatsuPrice}</span>
              <span className={`${styles.rakusatsuPrice} `}>
                <CurrencyYenIcon />
                {fetchGoodsData?.rakusatsuPrice}
              </span>
            </p>
          </div>

          <div>
            {goodsAddInfo.map((data) => {
              if (!data || typeof data.seq === "undefined") return null;
              const value = fetchGoodsData ? fetchGoodsData[`addInfo${data.seq}`] || "" : "";

              return (
                data.goodsAddinfo &&
                value && (
                  <React.Fragment key={data.seq}>
                    <div className={styles.addInfoContainer}>
                      <label htmlFor={`addInfo${data.seq}`} className={styles.addInfoLabel}>
                        {data.goodsAddinfo}
                      </label>
                      <p className={styles.description}>{value}</p>
                    </div>
                  </React.Fragment>
                )
              );
            })}
          </div>
          {fetchGoodsData && fetchGoodsData.biko && (
            <div className={styles.detailContainer}>
              <div className={styles.detailContent}>
                <p
                  className={styles.biko}
                  dangerouslySetInnerHTML={{
                    __html: fetchGoodsData.biko.replace(/\r?\n|\r/g, "<br />"),
                  }}
                ></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {popupOpen && thumImages.length > 0 && (
        <ImagePopupComponent
          open={popupOpen}
          onClose={handleClose}
          images={thumImages}
          currentIndex={popupIndex}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
};

export default withMemberLayout(Page);
