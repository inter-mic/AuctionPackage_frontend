/**
 * 数値をカンマ区切りの文字列に変換し、/1000 した結果を返します
 * @param price - 元の数値
 * @returns カンマ区切りの文字列
 */
export const formatPriceDivision = (price: string): string => {
    return (Number(price) / 1000).toLocaleString();
  };
  
  /**
   * カンマ区切りの文字列を数値に変換し、1000を掛けた結果を返します
   * @param price - カンマ区切りの文字列
   * @returns 数値
   */
  export const formatPriceMultiplication = (price: string): number => {
    return Number(price.replace(/,/g, '')) * 1000;
  };
  
  /**
   * 数値をカンマ区切りの文字列に変換します
   * @param price - 元の数値
   * @returns カンマ区切りの文字列
   */
  export const formatPriceWithCommas = (price: number): string => {
    return price.toLocaleString();
  };
  