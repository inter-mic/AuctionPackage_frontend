//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';

export const useTenderBidAPI = () => {
    const { useState, apiRequest } = useCommonSetup();
    const [tenderBidErrors, setTenderBidErrors] = useState<Errors>();
    const [tenderBidResponseStatus, setTenderBidResponseStatus] = useState<number>();
    const tenderBidAPI = async (goodsId: number, bidPrice: number) => {
        const params = {
            bidPrice: bidPrice,
        };
        const { status, data: responseData } = await apiRequest("member", `bid/tenderBid/${goodsId}`, 'POST', params, "", true);
        if (status == 400) {
            setTenderBidResponseStatus(responseData);
        }
        setTenderBidResponseStatus(status);
        if (status === 200) {
            setTimeout(() => setTenderBidResponseStatus(undefined), 100);
        }
    };

    return { tenderBidResponseStatus, tenderBidErrors, tenderBidAPI }
};