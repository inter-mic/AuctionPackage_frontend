import { useCallback } from 'react';
export interface Kengen {
  screenId: number;
  kengenKbn: number;
}
export const useToTorihikiMeisai = (kengen: Kengen[]) => {
  const toTorihikiMeisai = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      auctionSeq: number,
      userId: number,
    ) => {
      // クリックした要素が `HTMLInputElement` の場合は処理を中断
      if (e.target instanceof HTMLInputElement) return;
      const hasClickKengen = kengen.some(
        (k) => k.screenId === 201 && (k.kengenKbn === 1 || k.kengenKbn === 2)
      );
      if (hasClickKengen) {
        window.open(`/admin/member/torihikijisseki/meisai?auctionSeq=${auctionSeq}&userId=${userId}`, '_blank');
      }
    },
    [kengen]
  );

  return { toTorihikiMeisai };
};
