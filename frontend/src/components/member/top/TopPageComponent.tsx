import React from "react";
import { format } from "date-fns";
// スライダーライブラリ
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useGoodsSearchParams } from "@/hooks/searchParams/common/useGoodsSearchParams";
//API
import { useInfoSearchAPI } from "@/hooks/api/common/useInfoSearchAPI";
import { useTopImageSearchAPI } from "@/hooks/api/common/useTopImageSearchAPI";
import { useGoodsSearchAPI } from "@/hooks/api/common/useGoodsSearchAPI";
import { useAuctionKaisaiChuSearchAPI } from "@/hooks/api/common/useAuctionKaisaiChuSearchAPI";
//コンポーネント
import TopImageSlider from "@/components/ui/images/ImageSliderTop";
import AuctionImageSlider from "@/components/ui/images/ImageSliderAuction";
import GoodsList from "@/components/member/goods/GoodsListComponent";
//型定義
import { TPageProps } from "@/types/member/memberPage";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/Top.module.css";

interface Props extends TPageProps {
  isLogin: boolean;
  loginUserId: number;
  canBid: boolean;
}
const TopPageComponent: React.FC<Props> = ({ isLogin, loginUserId, canBid }) => {
  const { useEffect, texts } = useCommonSetup();
  //TOP画像
  const { topImageList } = useTopImageSearchAPI(isLogin);
  //お知らせ
  const { info } = useInfoSearchAPI(isLogin);
  //開催中のオークション
  const { auctionKaisaiChuList, auctionKaisaiChuSearchAPI } = useAuctionKaisaiChuSearchAPI();
  useEffect(() => {
    auctionKaisaiChuSearchAPI(isLogin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //注目作品
  const { goodsList, goodsSearchAPI } = useGoodsSearchAPI();
  const { goodsParams } = useGoodsSearchParams();
  useEffect(() => {
    const params = {
      ...goodsParams,
      chumokuCheck: true,
      nofinishCheck: true,
    };
    goodsSearchAPI(params, isLogin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TopImageSlider images={topImageList} />

      <div className={`${memberStyles.memberContainer}`}>
        <div className="w-full">
          {info && info.length > 0 ? (
            <>
              <div className={styles.infoContainer}>
                {info.map((item, index) => (
                  <div key={index} className={styles.infoRow}>
                    <span className={styles.infoTime}>
                      {format(new Date(item.displayStarttime), "yyyy.MM.dd")}
                    </span>
                    {item.naiyoUrl ? (
                      <a
                        href={item.naiyoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.infoText} ${styles.link}`}
                      >
                        {item.naiyo}
                      </a>
                    ) : (
                      <span className={styles.infoText}>{item.naiyo}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
        {auctionKaisaiChuList && auctionKaisaiChuList.length > 0 ? (
          <div className="w-full">
            <h1 className={styles.title}>
              <span>{texts.top.auction}</span>
            </h1>
            <AuctionImageSlider auctionKaisaiChuList={auctionKaisaiChuList} isLogin={isLogin} />
          </div>
        ) : (
          <div></div>
        )}

        {goodsList && goodsList.length > 0 ? (
          <>
            <h1 className={styles.title}>
              <span>{texts.top.hotGoods}</span>
            </h1>
            <div className={`${memberStyles.memberContainer} p-2`}>
              <GoodsList
                list={goodsList}
                isLogin={isLogin}
                loginUserId={loginUserId}
                canBid={canBid}
              />
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default TopPageComponent;
