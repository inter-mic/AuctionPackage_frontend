//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';

export const useLiveJizenBidRegistAPI = () => {
    const { useState, texts, apiRequest } = useCommonSetup();
    const [liveJizenBidErrors, setLiveJizenBidErrors] = useState<Errors>();
    const [liveJizenBidResponseStatus, setLiveJizenBidResponseStatus] = useState<number>();
    const liveJizenBidRegistAPI = async (goodsId: number, bidPrice: number) => {
        const params = {
            bidPrice: bidPrice,
        };
        const { status, data: responseData } = await apiRequest("member", `jizenBid/regist/${goodsId}`, 'POST', params, texts.message.regist, true);
        if (status == 400) {
            setLiveJizenBidErrors(responseData);
        }
        setLiveJizenBidResponseStatus(status);
        if (status === 200) {
            setTimeout(() => setLiveJizenBidResponseStatus(undefined), 100);
        }
    };

    return { liveJizenBidResponseStatus, liveJizenBidErrors, liveJizenBidRegistAPI }
};