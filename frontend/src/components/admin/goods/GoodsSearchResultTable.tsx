import React from "react";
import Image from "next/image";
import { TAdminGoodsSelect } from "@/types/admin/goods/search";

interface GoodsSearchResultTableProps {
  goodsData: TAdminGoodsSelect[];
  selectAll: boolean;
  selectedIds: number[];
  hoveredRow: number | null;
  hoveredShuppin: number | null;
  hoveredRakusatsu: number | null;
  hoveredBidCount: number | null;
  hoveredFavoriteCount: number | null;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (id: number) => void;
  onRowClick: (e: React.MouseEvent<HTMLTableRowElement>, goodsId: number) => void;
  onUserClick: (e: React.MouseEvent<HTMLElement>, userId: string) => void;
  onMouseEnterRow: (goodsId: number) => void;
  onMouseLeaveRow: () => void;
  onMouseEnterShuppin: (goodsId: number) => void;
  onMouseLeaveShuppin: () => void;
  onMouseEnterRakusatsu: (goodsId: number) => void;
  onMouseLeaveRakusatsu: () => void;
  onMouseEnterBidCount: (goodsId: number) => void;
  onMouseLeaveBidCount: () => void;
  onBidCountClick: (e: React.MouseEvent<HTMLElement>, goodsId: number, auctionSeq: number) => void;
  onMouseEnterFavoriteCount: (goodsId: number) => void;
  onMouseLeaveFavoriteCount: () => void;
  onFavoriteCountClick: (e: React.MouseEvent<HTMLElement>, goodsId: number) => void;
  texts: any;
}

export const GoodsSearchResultTable: React.FC<GoodsSearchResultTableProps> = ({
  goodsData,
  selectAll,
  selectedIds,
  hoveredRow,
  hoveredShuppin,
  hoveredRakusatsu,
  hoveredBidCount,
  hoveredFavoriteCount,
  onSelectAll,
  onSelect,
  onRowClick,
  onUserClick,
  onMouseEnterRow,
  onMouseLeaveRow,
  onMouseEnterShuppin,
  onMouseLeaveShuppin,
  onMouseEnterRakusatsu,
  onMouseLeaveRakusatsu,
  onMouseEnterBidCount,
  onMouseLeaveBidCount,
  onBidCountClick,
  onMouseEnterFavoriteCount,
  onMouseLeaveFavoriteCount,
  onFavoriteCountClick,
  texts,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th rowSpan={2} className="py-2 px-4 border-b">
            <input type="checkbox" checked={selectAll} onChange={onSelectAll} />
          </th>
          <th rowSpan={2} className="py-2 px-4 w-20 border-b">
            {texts.goods.thumbnailImageUrl}
          </th>
          <th className="py-2 px-4 border-b">{texts.goods.goodsId}</th>
          <th className="py-2 px-4 border-b">{texts.goods.sku}</th>
          <th rowSpan={2} className="py-2 px-4 border-b w-24">
            {texts.goods.lot}
          </th>
          {goodsData[0]?.spnKbn === "1" || goodsData[0]?.spnKbn === "2" ? (
            <>
              <th rowSpan={2} className="py-2 px-4 border-b w-44">
                {texts.goods.startPrice}
              </th>
              <th rowSpan={2} className="py-2 px-4 border-b w-44">
                {texts.goods.rakusatsuPrice}
              </th>
            </>
          ) : (
            <>
              <th className="py-2 px-4 border-b w-24">{texts.goods.favoriteCount}</th>
              <th className="py-2 px-4 border-b w-44">{texts.goods.startPrice}</th>
              <th rowSpan={2} className="py-2 px-4 border-b w-96">
                {texts.auction.bidKikan}
              </th>
            </>
          )}
          <th rowSpan={2} className="py-2 px-4 border-b">
            {texts.goods.kekkaStatus}
          </th>
          <th className="py-2 px-4 border-b">
            {texts.goods.shuppinUserName}/{texts.goods.shuppinCompanyName}
          </th>
        </tr>
        <tr>
          <th colSpan={2} className="py-2 px-4 border-b">
            {texts.goods.goodsName}
          </th>
          {goodsData[0]?.spnKbn === "1" || goodsData[0]?.spnKbn === "2" ? (
            <></>
          ) : (
            <>
              <th className="py-2 px-4 border-b w-24">{texts.goods.bidCount}</th>
              <th className="py-2 px-4 border-b w-44">{texts.goods.currentPrice}</th>
            </>
          )}
          <th className="py-2 px-4 border-b">
            {texts.goods.rakusatsuUserName}/{texts.goods.rakusatsuCompanyName}
          </th>
        </tr>
      </thead>
      <tbody>
        {goodsData.length > 0 &&
          goodsData.map((result) => (
            <React.Fragment key={result.goodsId}>
              <tr
                className={`cursor-pointer ${hoveredRow === result.goodsId ? "bg-gray-100" : ""}`}
                onMouseEnter={() => onMouseEnterRow(result.goodsId)}
                onMouseLeave={onMouseLeaveRow}
                onClick={(e) => onRowClick(e, result.goodsId)}
              >
                <td
                  rowSpan={2}
                  className="py-2 px-4 border-b text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(result.goodsId)}
                    onChange={() => onSelect(result.goodsId)}
                  />
                </td>
                <td rowSpan={2} className="py-2 px-4 w-20 border-b text-right">
                  <Image
                    src={
                      result.thumbnailImageUrl && result.thumbnailImageUrl.trim() !== ""
                        ? result.thumbnailImageUrl
                        : "/no_image.png"
                    }
                    alt=""
                    width={70}
                    height={70}
                  />
                </td>
                <td className="py-2 px-4 border-b text-left">{result.goodsId}</td>
                <td className="py-2 px-4 border-b text-left">{result.sku}</td>
                <td rowSpan={2} className="py-2 px-4 border-b text-left w-24">
                  {result.lot}
                </td>
                {goodsData[0]?.spnKbn === "1" || goodsData[0]?.spnKbn === "2" ? (
                  <>
                    <td rowSpan={2} className="py-2 px-4 border-b text-right w-44">
                      {result.startPrice}
                    </td>
                    <td rowSpan={2} className="py-2 px-4 border-b text-right w-44">
                      {result.rakusatsuPrice}
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      className={`py-2 px-4 border-b text-right w-24 cursor-pointer ${
                        hoveredFavoriteCount === result.goodsId ? "bg-blue-100" : ""
                      }`}
                      onMouseEnter={() => onMouseEnterFavoriteCount(result.goodsId)}
                      onMouseLeave={onMouseLeaveFavoriteCount}
                      onClick={(e) => onFavoriteCountClick(e, result.goodsId)}
                    >
                      {result.favoriteCount}
                    </td>
                    <td className="py-2 px-4 border-b text-right w-44">{result.startPrice}</td>
                    <td rowSpan={2} className="py-2 px-4 border-b text-right w-96">
                      {result.bidTime}
                    </td>
                  </>
                )}
                <td rowSpan={2} className="py-2 px-4 border-b text-left">
                  {result.auctionKekkaStatusStr}
                </td>
                <td
                  className={`py-2 px-4 border-b text-left ${
                    hoveredShuppin === result.goodsId ? "bg-blue-100" : ""
                  }`}
                  onMouseEnter={() => onMouseEnterShuppin(result.goodsId)}
                  onMouseLeave={onMouseLeaveShuppin}
                  onClick={(e) => onUserClick(e, result.shuppinUserId)}
                >
                  {result.shuppinUserName} {result.shuppinCompanyName}
                </td>
              </tr>

              <tr
                className={`cursor-pointer ${hoveredRow === result.goodsId ? "bg-gray-100" : ""}`}
                onMouseEnter={() => onMouseEnterRow(result.goodsId)}
                onMouseLeave={onMouseLeaveRow}
                onClick={(e) => onRowClick(e, result.goodsId)}
              >
                <td colSpan={2} className="py-2 px-4 border-b text-left">
                  {result.goodsName}
                </td>
                {goodsData[0]?.spnKbn === "1" || goodsData[0]?.spnKbn === "2" ? (
                  <></>
                ) : (
                  <>
                    <td
                      className={`py-2 px-4 border-b text-right w-24 cursor-pointer ${
                        hoveredBidCount === result.goodsId ? "bg-blue-100" : ""
                      }`}
                      onMouseEnter={() => onMouseEnterBidCount(result.goodsId)}
                      onMouseLeave={onMouseLeaveBidCount}
                      onClick={(e) => onBidCountClick(e, result.goodsId, result.auctionSeq)}
                    >
                      {result.bidCount}
                    </td>
                    <td className="py-2 px-4 border-b text-right w-44">{result.currentPrice}</td>
                  </>
                )}
                <td
                  className={`py-2 px-4 border-b text-left ${
                    hoveredRakusatsu === result.goodsId ? "bg-blue-100" : ""
                  }`}
                  onMouseEnter={() => onMouseEnterRakusatsu(result.goodsId)}
                  onMouseLeave={onMouseLeaveRakusatsu}
                  onClick={(e) => onUserClick(e, result.rakusatsuUserId)}
                >
                  {result.rakusatsuUserName} {result.rakusatsuCompanyName}
                </td>
              </tr>
            </React.Fragment>
          ))}
      </tbody>
    </table>
  );
};
