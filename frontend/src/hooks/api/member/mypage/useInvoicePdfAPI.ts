//コンフィグ
//API
import { usePdfApiRequest } from "@/hooks/api/usePdfApiRequest";

export const useInvoicePdfAPI = () => {
  const { pdfApiRequest } = usePdfApiRequest();
  const invoicePdfAPI = async (auctionSeq: number) => {
    const baseEndpoint = "outputPdf/invoice";
    const endPoint = `${baseEndpoint}/${auctionSeq}`;
    await pdfApiRequest("member", endPoint, "POST");
  };

  return { invoicePdfAPI };
};
