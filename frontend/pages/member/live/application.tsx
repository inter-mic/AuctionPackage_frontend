import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { GetServerSideProps } from "next";
import { useEffect, useState, useRef } from "react";
import { getTexts } from "@/config/texts";
import Image from "next/image";
//ホック
import { withAuth } from "@/hocs/withMemberAuth";
import withMemberLayout from "@/hocs/withMemberLayout";
//API
import { useAuctionKeisaiChuSearchAPI } from "@/hooks/api/common/useAuctionKeisaiChuSearchAPI";
import { useLocale } from "@/hooks/useLocale";
//型定義
import { TPageProps } from "@/types/member/memberPage";
import { TAuction } from "@/types/common/MtAuction";
//スタイル
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/Live/Application.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberLiveApplication,
    },
  };
});

const Page: React.FC<TPageProps> = (PageProps) => {
  const params = useSearchParams();
  const paramsAuctionSeq = params ? params.get("auctionSeq") : null;
  const [fetchAuctionData, setFetchAuctionData] = useState<TAuction>();
  const { auctionKeisaiChuList, auctionKeisaiChuSearchAPI } = useAuctionKeisaiChuSearchAPI();
  useEffect(() => {
    if (paramsAuctionSeq) {
      auctionKeisaiChuSearchAPI(Number(paramsAuctionSeq), true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsAuctionSeq]);
  useEffect(() => {
    if (auctionKeisaiChuList != null) {
      setFetchAuctionData(auctionKeisaiChuList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionKeisaiChuList]);
  const { texts } = useLocale();
  return (
    <div className={styles.container}>
      <div className={`${memberStyles.memberContainer}`}>
        <div>
          <h2 className={styles.auctionName}>{fetchAuctionData?.auctionName}</h2>
          <p>
            {texts.auction.auctionDate}:{" "}
            {fetchAuctionData?.auctionDatetime &&
              dayjs(fetchAuctionData.auctionDatetime).format("YYYY年MM月DD日 H:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default withMemberLayout(Page);
