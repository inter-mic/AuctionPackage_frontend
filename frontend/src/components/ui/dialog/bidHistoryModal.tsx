import React, { useEffect, useState } from "react";
import { texts } from "@/config/texts.ja";
import { useBidLogSearchAPI } from "@/hooks/api/admin/bid/useBidLogSearchAPI";
import { TAdminLogBidSelect } from "@/types/admin/goods/bid/logSearch";
interface BidHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  goodsId: number;
  auctionSeq: number;
}

export const BidHistoryModal: React.FC<BidHistoryModalProps> = ({
  isOpen,
  onClose,
  goodsId,
  auctionSeq,
}) => {
  const [bidHistory, setBidHistory] = useState<TAdminLogBidSelect[]>([]);
  const { data, bidLogSearchAPI } = useBidLogSearchAPI();

  useEffect(() => {
    setBidHistory([]);
    if (isOpen && goodsId && auctionSeq) {
      const searchParams = {
        goodsId: goodsId.toString(),
        auctionSeq: auctionSeq.toString(),
        pageNumber: 1,
        pageSize: 100, // 十分な件数を取得
        sortKey: "bidTime",
        sortFlg: false,
      };
      bidLogSearchAPI(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, goodsId, auctionSeq]);

  useEffect(() => {
    if (data) {
      setBidHistory(data);
    } else {
      setBidHistory([]);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{texts.menu.adminBidLogList}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {bidHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {texts.member.userName}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    {texts.member.companyName}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-right">
                    {texts.bid.bidPrice}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    {texts.bid.bidTime}
                  </th>
                </tr>
              </thead>
              <tbody>
                {bidHistory.map((bid, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-left">{bid.userName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {bid.companyName || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{bid.bidPrice}</td>
                    <td className="border border-gray-300 px-4 py-2  text-left">{bid.bidTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">{texts.message.noData}</div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            {texts.button.close}
          </button>
        </div>
      </div>
    </div>
  );
};
