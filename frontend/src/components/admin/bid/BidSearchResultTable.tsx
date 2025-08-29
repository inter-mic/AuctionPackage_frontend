import React from "react";
import { TAdminGoodsAuctionBidSelect } from "@/types/admin/goods/bid/search";

interface BidSearchResultTableProps {
  bidList: TAdminGoodsAuctionBidSelect[];
  selectAll: boolean;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  onRowClick: (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => void;
  onUserClick: (e: React.MouseEvent<HTMLElement>, userId: string) => void;
  texts: any;
}

export const BidSearchResultTable: React.FC<BidSearchResultTableProps> = ({
  bidList,
  selectAll,
  selectedIds,
  onSelectAll,
  onSelect,
  onRowClick,
  onUserClick,
  texts,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">
            <input type="checkbox" checked={selectAll} onChange={(e) => onSelectAll(e.target.checked)} />
          </th>
          <th className="py-2 px-4 border-b w-52">{texts.goods.auctionName}</th>
          <th className="py-2 px-4 border-b w-24">{texts.goods.goodsId}</th>
          <th className="py-2 px-4 border-b w-52">{texts.goods.sku}</th>
          <th className="py-2 px-4 border-b">{texts.goods.goodsName}</th>
          <th className="py-2 px-4 border-b w-24">{texts.goods.lot}</th>
          <th className="py-2 px-4 border-b w-44">{texts.bid.bidPrice}</th>
          <th className="py-2 px-4 border-b w-52">{texts.bid.bidTime}</th>
          <th className="py-2 px-4 border-b">{texts.member.userName}</th>
        </tr>
      </thead>
      <tbody>
        {bidList.length > 0 &&
          bidList.map((result) => (
            <tr
              key={`${result.goodsId}-${result.userId}`}
              className="cursor-pointer hover:bg-gray-100"
              onClick={(e) => onRowClick(e, result.goodsId)}
            >
              <td
                className="py-2 px-4 border-b text-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(`${result.goodsId}-${result.userId}`)}
                  onChange={() => onSelect(`${result.goodsId}-${result.userId}`)}
                />
              </td>
              <td className="py-2 px-4 border-b text-left w-52">{result.auctionName}</td>
              <td className="py-2 px-4 border-b text-left w-24">{result.goodsId}</td>
              <td className="py-2 px-4 border-b text-left w-52">{result.sku}</td>
              <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
              <td className="py-2 px-4 border-b text-left w-24">{result.lot}</td>
              <td className="py-2 px-4 border-b text-right w-44">{result.bidPrice}</td>
              <td className="py-2 px-4 border-b text-right w-52">{result.bidTime}</td>
              <td
                className="py-2 px-4 border-b text-left hover:bg-blue-100 hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onUserClick(e, result.userId);
                }}
              >
                {result.userName}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

