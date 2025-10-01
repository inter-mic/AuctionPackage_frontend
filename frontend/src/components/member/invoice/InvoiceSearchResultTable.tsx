import React from "react";
import { TVTorihikiJisseki } from "@/types/member/invoice";
import { OutPutButton } from "@/components/ui/buttons/member/outputButton";

interface InvoiceSearchResultTableProps {
  torihikiList: TVTorihikiJisseki[];
  texts: any;
  onInvoiceClick: (auctionSeq: number) => void;
}

export const InvoiceSearchResultTable: React.FC<InvoiceSearchResultTableProps> = ({
  torihikiList,
  texts,
  onInvoiceClick,
}) => {
  return (
    <div className="w-full mt-4">
      <table className="w-full sm:w-3/4 bg-white mx-auto">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">{texts.auction.auctionName}</th>
            <th className="py-2 px-4 border-b w-24">{texts.torihikiJisseki.rakusatsusu}</th>
            <th className="py-2 px-4 border-b w-56">
              {texts.torihikiJisseki.rakusatsuTotalPrice}
            </th>
            <th className="py-2 px-4 border-b w-56"></th>
          </tr>
        </thead>
        <tbody>
          {torihikiList.length > 0 &&
            torihikiList.map((result) => (
              <React.Fragment key={result.auctionSeq}>
                <tr>
                  <td className="py-2 px-4 border-b text-left">{result.auctionName}</td>
                  <td className="py-2 px-4 border-b text-right w-24">{result.rakusatsusu}</td>
                  <td className="py-2 px-4 border-b text-right w-56">
                    {result.rakusatsuTotalPrice}
                  </td>
                  <td className="py-2 px-4 border-b text-center w-56">
                    <OutPutButton
                      onClick={() => onInvoiceClick(result.auctionSeq)}
                      text={texts.button.invoice}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

