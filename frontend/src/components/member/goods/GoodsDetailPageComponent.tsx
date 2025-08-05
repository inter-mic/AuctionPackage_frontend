import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//コンポーネント
import FavoriteToggle from "@/components/member/goods/FavoriteToggleComponent";
import BidModuleComponent from "@/components/member/auction/BidModuleComponent";
import ImagePopupComponent from "@/components/member/goods/ImagePopupComponent";
//API
import { useGoodsSearchByGoodsIdAPI } from "@/hooks/api/common/useGoodsSearchByGoodsIdAPI";
import { useGoodsSearchImageAPI } from "@/hooks/api/common/useGoodsSearchImageAPI";
import { useGoodsSearchBeforeAfterLotAPI } from "@/hooks/api/common/useGoodsSearchBeforeAfterLotAPI";
import { useGoodsAddinfoItemAPI } from "@/hooks/api/public/useGoodsAddinfoItemAPI";
import { useMemberSessionAPI } from "@/hooks/api/member/useMemberSessionAPI";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { GoodsImageData } from "@/types/admin/goods/register";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/goods/GoodsDetail.module.css";
//アイコン
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface Props extends TPageProps {
  isLogin: boolean;
  loginUserId: number;
}

const MemberGoodsSearchPageComponent: React.FC<Props> = ({ isLogin, loginUserId }) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const params = useSearchParams();
  const paramsGoodsId = params ? params.get("goodsId") : null;
  const { goodsAddInfo } = useGoodsAddinfoItemAPI();
  const { fetchGoodsData, goodsSearchByGoodsIdAPI } = useGoodsSearchByGoodsIdAPI();
  const { fetchImages, goodsSearchImage } = useGoodsSearchImageAPI();
  const [thumImages, setThumImages] = useState<GoodsImageData[]>([]);
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
    if (fetchGoodsData && fetchGoodsData.squareImageUrl) {
      setMainImageSrc(fetchGoodsData.squareImageUrl);
      goodsSearchImage(Number(paramsGoodsId), isLogin);
    } else {
      setMainImageSrc("/no_image.png");
      setThumImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);
  useEffect(() => {
    if (fetchGoodsData) {
      const { lot, goodsName } = fetchGoodsData;
      document.title = `${texts.menu.memberGoodsDetail} | LOT: ${lot} ${goodsName}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData]);

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
    const auctionSeq = fetchGoodsData?.auctionSeq ?? 0;
    const lot = fetchGoodsData?.lot ?? "";
    if (auctionSeq != 0 && lot != "") {
      goodsSearchBeforeAfterLotAPI(auctionSeq, lot, isLogin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGoodsData?.auctionSeq, fetchGoodsData?.lot]);

  const [beforeGoodsId, setBeforeGoodsId] = useState<number | undefined>(undefined);
  const [afterGoodsId, setAfterGoodsId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (beforeAfterGoodsId) {
      setBeforeGoodsId(beforeAfterGoodsId.beforeGoodsId);
      setAfterGoodsId(beforeAfterGoodsId.afterGoodsId);
    }
  }, [beforeAfterGoodsId]);

  //サムネイル画像クリック
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageClick = (thumbnailUrl: string) => {
    const newImageUrl = thumbnailUrl.replace("thumb", "square");
    setMainImageSrc(newImageUrl);
    setSelectedImage(thumbnailUrl);
    // ポップアップは開かない
  };

  //タイムアウト防止のためセッション延長
  const { memberSessionAPI } = useMemberSessionAPI();
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isLogin) {
        memberSessionAPI();
      }
    }, 300000);
    return () => clearInterval(intervalId);
  }, [isLogin, memberSessionAPI]);

  // ポップアップ用の状態
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  // メイン画像クリック時
  const handleMainImageClick = () => {
    // selectedImageがある場合はそのインデックス、なければmainImageSrcで検索
    let idx = 0;
    if (selectedImage) {
      idx = thumImages.findIndex((img) => selectedImage === img.thumbnailImageUrl);
    } else {
      idx = thumImages.findIndex((img) => mainImageSrc.includes(img.squareImageUrl || ""));
    }
    setPopupIndex(idx >= 0 ? idx : 0);
    setPopupOpen(true);
  };

  // ポップアップ内の左右移動
  const handlePrev = () => {
    setPopupIndex((prev) => (prev - 1 + thumImages.length) % thumImages.length);
  };
  const handleNext = () => {
    setPopupIndex((prev) => (prev + 1) % thumImages.length);
  };
  const handleClose = () => {
    setPopupOpen(false);
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
              fetchGoodsData?.auctionSeq ?? 0
            )}`}
          >
            <div className={styles.link}>
              <KeyboardArrowLeftIcon />
              <span className={styles.auctionName}>{fetchGoodsData?.auctionName}</span>
            </div>
          </Link>
        ) : (
          <Link
            href={`/goods/search?auctionSeq=${encodeURIComponent(fetchGoodsData?.auctionSeq ?? 0)}`}
          >
            <div className={styles.link}>
              <KeyboardArrowLeftIcon />
              <span className={styles.auctionName}>{fetchGoodsData?.auctionName}</span>
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
        <div className={styles.imageWrapper}>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              marginBottom: "20px",
            }}
          >
            <Image
              src={mainImageSrc}
              alt=""
              fill
              quality={100}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain", cursor: "pointer" }}
              onClick={handleMainImageClick}
            />
          </div>

          <ImageList
            sx={{
              width: "100%",
              height: "auto",
              overflow: "visible",
            }}
            cols={7}
          >
            {thumImages.length > 0 ? (
              thumImages.map((data) => (
                <ImageListItem
                  key={data.goodsImagesNo}
                  sx={{
                    border: selectedImage === data.thumbnailImageUrl ? "1px solid black" : "none",
                  }}
                >
                  <Image
                    src={`${data.thumbnailImageUrl}`}
                    alt=""
                    width={100}
                    height={100}
                    quality={50}
                    loading="lazy"
                    onClick={() =>
                      data.thumbnailImageUrl && handleImageClick(data.thumbnailImageUrl)
                    }
                    style={{ cursor: "pointer" }}
                  />
                </ImageListItem>
              ))
            ) : (
              <p></p>
            )}
          </ImageList>
        </div>
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
                    {texts.goods.lot} {fetchGoodsData?.lot}
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
                    {texts.goods.lot} {fetchGoodsData?.lot}
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
                <FavoriteToggle
                  goodsId={Number(paramsGoodsId)}
                  initialFavoriteState={fetchGoodsData?.myFavoriteFlg ?? false}
                />
              </div>
            )}
          </h2>
          <h2 className={styles.goodsName}>{fetchGoodsData?.goodsName}</h2>

          {fetchGoodsData !== undefined && (
            <BidModuleComponent
              fetchGoodsData={fetchGoodsData}
              isLogin={isLogin}
              loginUserId={loginUserId}
            />
          )}

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

export default MemberGoodsSearchPageComponent;
