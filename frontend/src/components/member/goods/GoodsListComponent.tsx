import React from 'react';
import { toast } from 'react-toastify';
//型定義
import { TGoodsSelect } from '@/types/common/goods';

//コンポーネント
import MemberGoodsCard  from '@/components/member/goods/GoodsCardComponent';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useAuctionWebSocket } from '@/hooks/useAuctionWebSocket';
//型定義
import { TAuctionWebSocketData } from '@/types/member/AuctionWebSocket';
//スタイル
import memberStyles from '@/styles/member/MemberCommon.module.css';

interface Props {
  list: TGoodsSelect[];
  isLogin: boolean;
  loginUserId: number;
}
const GoodsListComponent: React.FC<Props> = ({ list, isLogin, loginUserId }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const [goodsData, setGoodsData] = useState<TGoodsSelect[]>(list);
  useEffect(() => {
    setGoodsData(list);
  }, [list]);
  const updateGoodsDataApp = useCallback(
    (data: TAuctionWebSocketData) => {
      setGoodsData((prevGoods) =>
        prevGoods.map((goods) => {
          if (goods.goodsId === data.goodsId) {
            
            if (document.visibilityState === "visible" && data.auctionBidFlg && data.bidUserId === loginUserId) {
            
              if (data.currentKenriUserId == loginUserId) {
                toast.success(texts.message.highestBid);
              } else {
                toast.warning(texts.message.noHighestBid);
              }
            }
            if (document.visibilityState === "visible" && !data.auctionBidFlg  && data.bidUserId === loginUserId) {
              toast.success(texts.message.registBid);
            }

            const isPriceUpdated =
            data.auctionBidFlg === false ? false : data.startCurrentPrice !== goods.startCurrentPrice;

           
            return {
              ...goods,
              ...data,
              isPriceUpdated,
              ...(data.bidUserId === loginUserId
                ? {
                    bidPrice: data.bidPrice,
                    nextBidPrice: data.nextBidPrice,
                  }
                : {
                    bidPrice: goods.bidPrice, // 元の値を維持
                    nextBidPrice: (() => {
                      const currentPrice = Number(data.startCurrentPrice.replace(/,/g, ""));
                      const bidPrice = Number(goods.bidPrice.replace(/,/g, "") || 0);
                      const bidUnit = Number(goods.bidUnit.replace(/,/g, "") || 0);
            
                      return (currentPrice > bidPrice ? currentPrice + bidUnit : bidPrice + bidUnit).toLocaleString();
                    })(),
                  }),
            };
          }
          return goods;
        })
      );
      setTimeout(() => {
        setGoodsData((prevGoods) =>
          prevGoods.map((goods) =>
            goods.goodsId === data.goodsId ? { ...goods, isPriceUpdated: false } : goods
          )
        );
      }, 1000);
    },
     // eslint-disable-next-line react-hooks/exhaustive-deps
    [setGoodsData]
  );
  
  
  const updateGoodsDataBatch = useCallback(
    (data: TAuctionWebSocketData) => {
      setGoodsData((prevGoods) =>
        prevGoods.map((goods) =>
          goods.goodsId === data.goodsId
            ? {
                ...goods,
                remainingTime: data.remainingTime,
                auctionTimeStatus: data.auctionTimeStatus,
              }
            : goods
        )
      );
    },
    [setGoodsData]
  );

  useAuctionWebSocket(updateGoodsDataApp, updateGoodsDataBatch, isLoaded);
 

 
  return (
    <>
     
      <div className={memberStyles.memberContainer}>
        {goodsData.map((data) => (
           <MemberGoodsCard 
           key={data.goodsId} 
           data={data} 
           isLogin={isLogin} 
           loginUserId={loginUserId} 
           texts={texts}
         />
        ))}
       
      </div>
     
    </>
  );
};

export default GoodsListComponent;
