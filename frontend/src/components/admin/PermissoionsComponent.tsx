export interface KengenMap {
    screenId: number;
    kengenKbn: number;
  }
  
  export const hasPermission = (
    kengen: KengenMap[],
    screenId: number,
    kengenKbnList: number[] = [1, 2]
  ): boolean => {
    return kengen.some(
      (k) => k.screenId === screenId && kengenKbnList.includes(k.kengenKbn)
    );
  };