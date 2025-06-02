import { TMtLiveBidUnit } from "@/types/common/bidUnit";
export function useBidUnit(
  spnKbn: string | string[] | undefined,
  goodsBidUnit: string | null,
  fetchBidUnitList: TMtLiveBidUnit[],
  price: string | null
): string | null {
  if (spnKbn === "2") {
    return goodsBidUnit;
  }
  const numericPrice = Number(price?.replace(/,/g, ""));

  if (isNaN(numericPrice)) return null;

  for (const item of fetchBidUnitList) {
    const from = Number(item.unitFrom);
    const to = Number(item.unitTo);

    if (!isNaN(from) && !isNaN(to) && numericPrice >= from && numericPrice <= to) {
      return item.bitUnit;
    }
  }

  return null;
}
