import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSessionExtension } from "@/hooks/useMemberSessionExtension";
import { useImageClickHandler } from "@/hooks/useImageClickHandler";
import { usePopupNavigation } from "@/hooks/usePopupNavigation";
//コンポーネント
import FavoriteToggle from "@/components/member/goods/FavoriteToggleComponent";
import BidModuleComponent from "@/components/member/auction/BidModuleComponent";
import ImagePopupComponent from "@/components/member/goods/ImagePopupComponent";
import { ImageWrapperComponent } from "@/components/member/goods/ImageWrapperComponent";
//API
import { useGoodsSearchByGoodsIdAPI } from "@/hooks/api/common/useGoodsSearchByGoodsIdAPI";
import { useGoodsSearchImageAPI } from "@/hooks/api/common/useGoodsSearchImageAPI";
import { useGoodsSearchBeforeAfterLotAPI } from "@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI";
import { useGoodsAddinfoItemAPI } from "@/hooks/api/public/useGoodsAddinfoItemAPI";

//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TGoodsImageData } from "@/types/common/goodsImage";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/goods/GoodsDetail.module.css";
//アイコン
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface Props extends TPageProps {
  isLogin: boolean;
  canBid: boolean;
  loginUserId: number;
}

const MemberGoodsSearchPageComponent: React.FC<Props> = ({ isLogin, loginUserId, canBid }) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const params = useSearchParams();
  const paramsGoodsId = params ? params.get("goodsId") : null;
  const { goodsAddInfo } = useGoodsAddinfoItemAPI();
  const { fetchGoodsData, goodsSearchByGoodsIdAPI } = useGoodsSearchByGoodsIdAPI();
  const { fetchImages, goodsSearchImage } = useGoodsSearchImageAPI();
  const [thumImages, setThumImages] = useState<TGoodsImageData[]>([]);
  const [localGoodsData, setLocalGoodsData] = useState(fetchGoodsData);
  const router = useRouter();

  // タブ複製用の状態
  const [tabCount, setTabCount] = useState<number>(1);

  useEffect(() => {
    if (paramsGoodsId) {
      goodsSearchByGoodsIdAPI(Number(paramsGoodsId), isLogin);
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsGoodsId]);
  const [mainImageSrc, setMainImageSrc] = useState("/no_image.png");
  useEffect(() => {
    if (fetchGoodsData) {
      setLocalGoodsData(fetchGoodsData);
      if (fetchGoodsData.squareImageUrl) {
        setMainImageSrc(fetchGoodsData.squareImageUrl);
        goodsSearchImage(Number(paramsGoodsId), isLogin);
      } else {
        setMainImageSrc("/no_image.png");
        setThumImages([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);
  useEffect(() => {
    if (localGoodsData) {
      const { lot, goodsName } = localGoodsData;
      document.title = `${texts.menu.memberGoodsDetail} | LOT: ${lot} ${goodsName}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localGoodsData]);

  useEffect(() => {
    if (fetchImages.length > 0) {
      setThumImages(fetchImages);
    } else {
      setThumImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchImages]);

  //LOT前後
  const { beforeAfterGoodsId, goodsSearchBeforeAfterLotAPI } = useGoodsSearchBeforeAfterLotAPI();
  useEffect(() => {
    const auctionSeq = localGoodsData?.auctionSeq ?? 0;
    const lot = localGoodsData?.lot ?? "";
    if (auctionSeq != 0 && lot != "") {
      goodsSearchBeforeAfterLotAPI(auctionSeq, lot, isLogin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localGoodsData?.auctionSeq, localGoodsData?.lot]);

  const [beforeGoodsId, setBeforeGoodsId] = useState<number | undefined>(undefined);
  const [afterGoodsId, setAfterGoodsId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (beforeAfterGoodsId) {
      setBeforeGoodsId(beforeAfterGoodsId.beforeGoodsId);
      setAfterGoodsId(beforeAfterGoodsId.afterGoodsId);
    }
  }, [beforeAfterGoodsId]);

  //タイムアウト防止のためセッション延長
  useSessionExtension({ isLogin });

  const {
    popupOpen,
    popupIndex,
    handlePopupOpen,
    handlePrev,
    handleNext,
    handleClose,
  } = usePopupNavigation({ thumImages });

  const { selectedImage, handleImageClick, handleMainImageClick } = useImageClickHandler({
    thumImages,
    mainImageSrc,
    setMainImageSrc,
    enablePopup: true,
    onPopupOpen: handlePopupOpen,
  });

  // お気に入りトグル時の処理
  const handleFavoriteToggle = (isFavorite: boolean) => {
    setLocalGoodsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteCount: isFavorite ? prev.favoriteCount + 1 : prev.favoriteCount - 1,
      };
    });
  };



  // タブ複製機能
  const handleDuplicateTabs = () => {
    const currentUrl = window.location.href;
    for (let i = 0; i < tabCount; i++) {
      window.open(currentUrl, "_blank");
    }
  };

  return (
    <>
      <div className={styles.headerContainer}>
        {isLogin ? (
          <Link
            href={`/member/goods/search?auctionSeq=${encodeURIComponent(
              localGoodsData?.auctionSeq ?? 0
            )}`}
          >
            <div className={styles.link}>
              <KeyboardArrowLeftIcon />
              <span className={styles.auctionName}>{localGoodsData?.auctionName}</span>
            </div>
          </Link>
        ) : (
          <Link
            href={`/goods/search?auctionSeq=${encodeURIComponent(localGoodsData?.auctionSeq ?? 0)}`}
          >
            <div className={styles.link}>
              <KeyboardArrowLeftIcon />
              <span className={styles.auctionName}>{localGoodsData?.auctionName}</span>
            </div>
          </Link>
        )}
      </div>

      {/* タブ複製機能 */}
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <TextField
          type="number"
          label="タブ数"
          value={tabCount}
          onChange={(e) => setTabCount(Math.max(1, parseInt(e.target.value) || 1))}
          inputProps={{ min: 1, max: 10 }}
          size="small"
          style={{ width: "120px" }}
        />
        <Button variant="contained" onClick={handleDuplicateTabs} size="small">
          タブを複製
        </Button>
      </div>

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
              {isLogin ? (
                <>
                  {beforeGoodsId !== 0 && (
                    <Link href={`/member/goods/detail?goodsId=${beforeGoodsId}`} passHref>
                      <KeyboardArrowLeftIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                  <span className={styles.lotLabel}>
                    {texts.goods.lot} {localGoodsData?.lot}
                  </span>
                  {afterGoodsId !== 0 && (
                    <Link href={`/member/goods/detail?goodsId=${afterGoodsId}`} passHref>
                      <KeyboardArrowRightIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {beforeGoodsId !== 0 && (
                    <Link href={`/goods/detail?goodsId=${beforeGoodsId}`} passHref>
                      <KeyboardArrowLeftIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                  <span className={styles.lotLabel}>
                    {texts.goods.lot} {localGoodsData?.lot}
                  </span>
                  {afterGoodsId !== 0 && (
                    <Link href={`/goods/detail?goodsId=${afterGoodsId}`} passHref>
                      <KeyboardArrowRightIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                </>
              )}
            </div>
            {isLogin && (
              <div className={styles.favoriteRight}>
                {localGoodsData?.chumokuFlg && (
                  <div className={styles.badge}>{texts.goods.chumokuFlg}</div>
                )}
                {loginUserId === Number(localGoodsData?.shuppinUserId) && (
                  <div className={styles.badge}>{texts.label.mySpn}</div>
                )}
                <FavoriteToggle
                  goodsId={Number(paramsGoodsId)}
                  initialFavoriteState={localGoodsData?.myFavoriteFlg ?? false}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            )}
          </h2>
          <h2 className={styles.goodsName}>{localGoodsData?.goodsName}</h2>

          {localGoodsData !== undefined && (
            <BidModuleComponent
              fetchGoodsData={localGoodsData}
              isLogin={isLogin}
              canBid={canBid}
              loginUserId={loginUserId}
            />
          )}

          <div>
            {goodsAddInfo.map((data) => {
              if (!data || typeof data.seq === "undefined") return null;
              const value = localGoodsData ? localGoodsData[`addInfo${data.seq}`] || "" : "";

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
          {localGoodsData && localGoodsData.biko && (
            <div className={styles.detailContainer}>
              <div className={styles.detailContent}>
                <p
                  className={styles.biko}
                  dangerouslySetInnerHTML={{
                    __html: localGoodsData.biko.replace(/\r?\n|\r/g, "<br />"),
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

export default MemberGoodsSearchPageComponent;
