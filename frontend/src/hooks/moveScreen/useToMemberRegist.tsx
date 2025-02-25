import { useCallback } from 'react';
export interface Kengen {
  screenId: number;
  kengenKbn: number;
}
export const useToMemberRegist = (kengen: Kengen[]) => {
  const toMemberRegist = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      id: number,
    ) => {
      // クリックした要素が `HTMLInputElement` の場合は処理を中断
      if (e.target instanceof HTMLInputElement) return;
      const hasClickKengen = kengen.some(
        (k) => k.screenId === 101 && (k.kengenKbn === 1 || k.kengenKbn === 2)
      );
      if (hasClickKengen) {
        window.open(`/admin/member/register?userId=${id}`, '_blank');
      }
    },
    [kengen]
  );

  return { toMemberRegist };
};
