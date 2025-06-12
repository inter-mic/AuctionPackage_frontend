//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { usePdfApiRequest } from "@/hooks/api/usePdfApiRequest";

export const useInvoicePdfAPI = () => {
  const { pdfApiRequest } = usePdfApiRequest();
  const invoicePdfAPI = async (auctionSeq: number, selectedUserIds: number[]) => {
    const baseEndpoint = "outputPdf/invoice";
    const endPoint = `${baseEndpoint}/${auctionSeq}`;

    await pdfApiRequest("admin", endPoint, "POST", selectedUserIds);
  };

  return { invoicePdfAPI };
};
