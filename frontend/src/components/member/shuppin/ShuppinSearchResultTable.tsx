import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { TSpnSelect } from "@/types/member/shuppin";

interface ShuppinSearchResultTableProps {
  resultsList: TSpnSelect[];
  texts: any;
}

export const ShuppinSearchResultTable: React.FC<ShuppinSearchResultTableProps> = ({
  resultsList,
  texts,
}) => {
  const router = useRouter();

  const handleDetailClick = (goodsId: number) => {
    router.push(`/member/goods/detail?goodsId=${goodsId}`);
  };
  return (
    <div className="w-full">
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{texts.goods.thumbnailImageUrl}</th>
            <th className="py-2 px-4 border-b">{texts.goods.lot}</th>
            <th className="py-2 px-4 border-b">{texts.goods.goodsName}</th>
            <th className="py-2 px-4 border-b">{texts.goods.startPrice}</th>
            {resultsList[0]?.spnKbn === "3" ? (
              <>
                <th className="py-2 px-4 border-b">{texts.goods.currentPrice}</th>
              </>
            ) : (
              <></>
            )}
            <th className="py-2 px-4 border-b">{texts.goods.kekkaStatus}</th>
            <th className="py-2 px-4 border-b">{texts.goods.rakusatsuPrice}</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {resultsList.length > 0 &&
            resultsList.map((result) => (
              <React.Fragment key={result.goodsId}>
                <tr>
                  <td className="py-2 px-4 border-b">
                    <Image
                      src={
                        result.thumbnailImageUrl && result.thumbnailImageUrl.trim() !== ""
                          ? result.thumbnailImageUrl
                          : "/no_image.png"
                      }
                      alt=""
                      width={50}
                      height={50}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">{result.lot}</td>
                  <td className="py-2 px-4 border-b text-left">{result.goodsName}</td>
                  <td className="py-2 px-4 border-b text-right">{result.startPrice}</td>
                  {resultsList[0]?.spnKbn === "3" ? (
                    <>
                      <td className="py-2 px-4 border-b text-right">{result.currentPrice}</td>
                    </>
                  ) : (
                    <></>
                  )}
                  <td className="py-2 px-4 border-b text-right">{result.auctionKekkaStatusName}</td>
                  <td className="py-2 px-4 border-b text-right">{result.rakusatsuPrice}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {result.isDisplayKikan && (
                      <button
                        onClick={() => handleDetailClick(result.goodsId)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        詳細
                      </button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};
