import React from "react";
import Image from "next/image";
import { TResultsSelect } from "@/types/member/results";

interface ResultsSearchResultTableProps {
  resultsList: TResultsSelect[];
  texts: any;
}

export const ResultsSearchResultTable: React.FC<ResultsSearchResultTableProps> = ({
  resultsList,
  texts,
}) => {
  return (
    <div className="w-full">
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{texts.goods.thumbnailImageUrl}</th>
            <th className="py-2 px-4 border-b">{texts.goods.lot}</th>
            <th className="py-2 px-4 border-b">{texts.goods.goodsName}</th>
            <th className="py-2 px-4 border-b">{texts.goods.rakusatsuPrice}</th>
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
                  <td className="py-2 px-4 border-b text-right">{result.rakusatsuPrice}</td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

