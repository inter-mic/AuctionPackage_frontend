import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useSessionExtension } from "@/hooks/useMemberSessionExtension";
import { useImageClickHandler } from "@/hooks/useImageClickHandler";
import { usePopupNavigation } from "@/hooks/usePopupNavigation";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import { useGoodsListContext } from "@/contexts/GoodsListContext";
//コンポーネント
import FavoriteToggle from "@/components/member/goods/FavoriteToggleComponent";
import BidModuleComponent from "@/components/member/auction/BidModuleComponent";
import ImagePopupComponent from "@/components/member/goods/ImagePopupComponent";
import { ImageWrapperComponent } from "@/components/member/goods/ImageWrapperComponent";
import { ViewerCountPopup } from "@/components/member/goods/ViewerCountPopup";
//API
import { useGoodsSearchByGoodsIdAPI } from "@/hooks/api/common/useGoodsSearchByGoodsIdAPI";
import { useGoodsSearchImageAPI } from "@/hooks/api/common/useGoodsSearchImageAPI";
import { useGoodsAddinfoItemAPI } from "@/hooks/api/public/useGoodsAddinfoItemAPI";
import { useViewersTouchAPI } from "@/hooks/api/member/viewers/useViewersTouchAPI";
import { useViewersRemoveAPI } from "@/hooks/api/member/viewers/useViewersRemoveAPI";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TGoodsImageData } from "@/types/common/goodsImage";
import { TGoodsSelect } from "@/types/common/goods";
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
  goodsList?: TGoodsSelect[];
}

const MemberGoodsSearchPageComponent: React.FC<Props> = ({
  isLogin,
  loginUserId,
  canBid,
  goodsList,
  auctionBidUnitList,
}) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const params = useSearchParams();
  const paramsGoodsId = params ? params.get("goodsId") : null;
  const { goodsList: contextGoodsList } = useGoodsListContext();
  const { goodsAddInfo } = useGoodsAddinfoItemAPI();
  const { fetchGoodsData, goodsSearchByGoodsIdAPI } = useGoodsSearchByGoodsIdAPI();
  const { fetchImages, goodsSearchImage } = useGoodsSearchImageAPI();
  const { touchViewersAPI } = useViewersTouchAPI();
  const { removeViewersAPI } = useViewersRemoveAPI();
  const [thumImages, setThumImages] = useState<TGoodsImageData[]>([]);
  const [localGoodsData, setLocalGoodsData] = useState(fetchGoodsData);
  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [showViewerPopup, setShowViewerPopup] = useState(false);
  const router = useRouter();


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
     
  }, [fetchImages]);

  // 商品一覧ベースの前後ナビゲーション
  const [beforeGoodsId, setBeforeGoodsId] = useState<number | undefined>(undefined);
  const [afterGoodsId, setAfterGoodsId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // プロップスまたはコンテキストから商品一覧を取得
    const availableGoodsList = goodsList || contextGoodsList;

    if (availableGoodsList && availableGoodsList.length > 0 && paramsGoodsId) {
      const currentGoodsId = Number(paramsGoodsId);
      const currentIndex = availableGoodsList.findIndex(
        (goods) => goods.goodsId === currentGoodsId
      );

      if (currentIndex !== -1) {
        // 前の商品IDを設定
        const beforeIndex = currentIndex - 1;
        setBeforeGoodsId(beforeIndex >= 0 ? availableGoodsList[beforeIndex].goodsId : undefined);

        // 次の商品IDを設定
        const afterIndex = currentIndex + 1;
        setAfterGoodsId(
          afterIndex < availableGoodsList.length
            ? availableGoodsList[afterIndex].goodsId
            : undefined
        );
      } else {
        // 商品一覧に現在の商品が見つからない場合は、前後ボタンを無効化
        setBeforeGoodsId(undefined);
        setAfterGoodsId(undefined);
      }
    } else {
      // 商品一覧が提供されていない場合は、前後ボタンを無効化
      setBeforeGoodsId(undefined);
      setAfterGoodsId(undefined);
    }
     
  }, [goodsList, contextGoodsList, paramsGoodsId]);

  //タイムアウト防止のためセッション延長
  useSessionExtension({ isLogin });

  const { popupOpen, popupIndex, handlePopupOpen, handlePrev, handleNext, handleClose } =
    usePopupNavigation({ thumImages });

  const { selectedImage, handleImageClick, handleMainImageClick } = useImageClickHandler({
    thumImages,
    mainImageSrc,
    setMainImageSrc,
    enablePopup: true,
    onPopupOpen: handlePopupOpen,
  });

  // お気に入りトグル時の処理
  const { handleFavoriteToggle } = useFavoriteToggle(setLocalGoodsData);

  // 閲覧数の取得と表示
  useEffect(() => {
    if (paramsGoodsId && isLogin && loginUserId) {
      const goodsId = Number(paramsGoodsId);
      const sessionId = String(loginUserId);

      // 閲覧数を取得
      const fetchViewerCount = async () => {
        const result = await touchViewersAPI(goodsId, sessionId);
        console.log(result);
        if (result && result.length > 0) {
          const count = result[0].count;
          setViewerCount(count);
          setShowViewerPopup(true);
        }
      };

      fetchViewerCount();

      // クリーンアップ関数：画面を閉じたときに閲覧数を削除
      return () => {
        removeViewersAPI(goodsId, sessionId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsGoodsId, isLogin, loginUserId]);

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
                  {beforeGoodsId !== undefined && beforeGoodsId !== 0 && (
                    <Link href={`/member/goods/detail?goodsId=${beforeGoodsId}`} passHref>
                      <KeyboardArrowLeftIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                  <span className={styles.lotLabel}>
                    {texts.goods.lot} {localGoodsData?.lot}
                  </span>
                  {afterGoodsId !== undefined && afterGoodsId !== 0 && (
                    <Link href={`/member/goods/detail?goodsId=${afterGoodsId}`} passHref>
                      <KeyboardArrowRightIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {beforeGoodsId !== undefined && beforeGoodsId !== 0 && (
                    <Link href={`/goods/detail?goodsId=${beforeGoodsId}`} passHref>
                      <KeyboardArrowLeftIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                  <span className={styles.lotLabel}>
                    {texts.goods.lot} {localGoodsData?.lot}
                  </span>
                  {afterGoodsId !== undefined && afterGoodsId !== 0 && (
                    <Link href={`/goods/detail?goodsId=${afterGoodsId}`} passHref>
                      <KeyboardArrowRightIcon className={styles.clickableIcon} />
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className={styles.favoriteRight}>
              {localGoodsData?.chumokuFlg && (
                <div className={styles.badge}>{texts.goods.chumokuFlg}</div>
              )}
              {isLogin && (
                <>
                  {loginUserId === Number(localGoodsData?.shuppinUserId) && (
                    <div className={styles.badge}>{texts.label.mySpn}</div>
                  )}
                  <FavoriteToggle
                    goodsId={Number(paramsGoodsId)}
                    initialFavoriteState={localGoodsData?.myFavoriteFlg ?? false}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </>
              )}
            </div>
          </h2>
          <h2 className={styles.goodsName}>{localGoodsData?.goodsName}</h2>

          {localGoodsData !== undefined && (
            <BidModuleComponent
              fetchGoodsData={localGoodsData}
              isLogin={isLogin}
              canBid={canBid}
              loginUserId={loginUserId}
              auctionBidUnitList={isLogin ? auctionBidUnitList : []}
              livebitBidUnitList={ []}
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

      {showViewerPopup && viewerCount !== null && (
        <ViewerCountPopup
          count={viewerCount}
          onClose={() => setShowViewerPopup(false)}
        />
      )}
    </>
  );
};

export default MemberGoodsSearchPageComponent;
