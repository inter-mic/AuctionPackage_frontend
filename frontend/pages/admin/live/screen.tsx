import React from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { texts } from "@/config/texts.ja";
import { useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminNoHeaderLayout from "@/hocs/withAdminNoHeaderLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useKengenRedirect } from "@/hooks/useKengenRedirect";

import { PageProps } from "@/types/admin/adminPage";

//スタイル
import styles from "@/styles/admin/Screen.module.css";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminAuctionner,
    },
  };
});

const Page: React.FC<PageProps> = ({ kengen }) => {
  const { useState, useEffect } = useCommonSetup();
  useKengenRedirect(kengen, 354);

  const [receivedData, setReceivedData] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>();
  const [marqueeKey, setMarqueeKey] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_LIVE_URL}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (
        data.type === "set" ||
        data.type === "start" ||
        data.type === "updatePrice" ||
        data.type === "clear"
      ) {
        setReceivedData(data);
      }

      if (data.type === "sendMessage") {
        setMsg(data.message);
        setMarqueeKey((k) => k + 1);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src={receivedData?.goodsImage || "/no_image.png"}
            alt=""
            width={1500}
            height={1500}
            loading="lazy"
          />
        </div>
        <div className={styles.priceWrapper}>
          <div className={styles.goodsInfo}>
            LOT {receivedData?.lot}
            <br />
            {receivedData?.goodsName}
          </div>
          <div className={styles.priceLine}>
            <span className={styles.label}>現在価格</span>
            <span className={styles.amount}>
              {" "}
              {receivedData?.currentPrice &&
                new Intl.NumberFormat("ja-JP").format(receivedData.currentPrice)}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.flowingMsgDiv}>
        <span key={marqueeKey} className={styles.marquee}>
          {msg}
        </span>
      </div>
    </div>
  );
};

export default withAdminNoHeaderLayout(Page);
