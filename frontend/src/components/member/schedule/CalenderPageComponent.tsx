//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//コンポーネント
import AuctionInfo from "@/components/member/schedule/AuctionInfoComponent";
//API
import { useAuctionKeisaiChuSearchAPI } from "@/hooks/api/common/useAuctionKeisaiChuSearchAPI";
//型定義
import { TPageProps } from "@/types/member/memberPage";

interface Props extends TPageProps {
  isLogin: boolean;
}

const CalenderPageComponent: React.FC<Props> = ({ isLogin }) => {
  const { useEffect } = useCommonSetup();
  const { auctionKeisaiChuList, auctionKeisaiChuSearchAPI } = useAuctionKeisaiChuSearchAPI();

  useEffect(() => {
    auctionKeisaiChuSearchAPI(0, isLogin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {auctionKeisaiChuList != null ? (
        auctionKeisaiChuList.map((auctionData) => (
          <div key={auctionData.auctionSeq}>
            <AuctionInfo auctionData={auctionData} isToGoodsList={true} isLogin={isLogin} />
          </div>
        ))
      ) : (
        <div></div>
      )}
    </>
  );
};

export default CalenderPageComponent;
