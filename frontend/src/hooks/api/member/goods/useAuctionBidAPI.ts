//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';

export const useAuctionBidAPI = () => {
    const { useState, apiRequest } = useCommonSetup();
    const [auctionBidErrors, setAuctionBidErrors] = useState<Errors>();
    const [auctionBidResponseStatus, setAuctionBidResponseStatus] = useState<number>();
    const auctionBidAPI = async (goodsId: number, bidPrice: number) => {
        const params = {
            bidPrice: bidPrice,
        };
        const { status, data: responseData } = await apiRequest("member", `bid/auctionBid/${goodsId}`, 'POST', params, "", true);
        if (status == 400) {
            setAuctionBidErrors(responseData);
        }
        setAuctionBidResponseStatus(status);
        if (status === 200) {
            setTimeout(() => setAuctionBidResponseStatus(undefined), 100);
        }
    };

    return { auctionBidResponseStatus, auctionBidErrors, auctionBidAPI }
};