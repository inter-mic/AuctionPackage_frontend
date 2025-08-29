import React from "react";
import { TAdminLogBidSelect } from "@/types/admin/goods/bid/logSearch";

interface BidLogSearchResultTableProps {
  bidList: TAdminLogBidSelect[];
  selectAll: boolean;
  selectedIds: string[];
  searchSpnKbn: string;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  onRowClick: (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => void;
  onUserClick: (e: React.MouseEvent<HTMLElement>, userId: string) => void;
  texts: any;
}

export const BidLogSearchResultTable: React.FC<BidLogSearchResultTableProps> = ({
  bidList,
  selectAll,
  selectedIds,
  searchSpnKbn,
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
          <th className="py-2 px-4 border-b ">{texts.goods.goodsName}</th>
          <th className="py-2 px-4 border-b w-24">{texts.goods.lot}</th>
          <th className="py-2 px-4 border-b w-44">{texts.bid.bidPrice}</th>
          <th className="py-2 px-4 border-b w-52">{texts.bid.bidTime}</th>
          {searchSpnKbn === "1" && (
            <th className="py-2 px-4 border-b w-32">{texts.paddle.paddleNo}</th>
          )}
          {(searchSpnKbn === "1" || searchSpnKbn === "2") && (
            <th className="py-2 px-4 border-b w-32">{texts.bid.bidKbn}</th>
          )}
          <th className="py-2 px-4 border-b">
            {texts.member.userName}/{texts.member.companyName}
          </th>
        </tr>
      </thead>
      <tbody>
        {bidList.length > 0 &&
          bidList.map((result) => (
            <tr
              key={result.seq}
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
                  checked={selectedIds.includes(result.seq)}
                  onChange={() => onSelect(result.seq)}
                />
              </td>
              <td className="py-2 px-4 border-b text-left">{result.auctionName}</td>
              <td className="py-2 px-4 border-b text-left">{result.goodsId}</td>
              <td className="py-2 px-4 border-b text-left">{result.sku}</td>
              <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
              <td className="py-2 px-4 border-b text-left">{result.lot}</td>
              <td className="py-2 px-4 border-b text-right">{result.bidPrice}</td>
              <td className="py-2 px-4 border-b text-right">{result.bidTime}</td>
              {searchSpnKbn === "1" && (
                <td className="py-2 px-4 border-b text-left">{result.paddleNo}</td>
              )}
              {(searchSpnKbn === "1" || searchSpnKbn === "2") && (
                <td className="py-2 px-4 border-b text-left">{result.bidKbnName}</td>
              )}
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

