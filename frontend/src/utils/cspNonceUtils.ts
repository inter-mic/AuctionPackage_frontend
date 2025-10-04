/**
 * CSP nonce生成と管理のユーティリティ
 * インラインスタイルを安全に許可するためのnonce管理
 */

import { randomBytes } from 'crypto';

/**
 * nonceを生成
 */
export const generateNonce = (): string => {
  return randomBytes(16).toString('base64');
};

/**
 * CSPヘッダーにnonceを追加
 */
export const addNonceToCSP = (cspHeader: string, nonce: string): string => {
  // style-srcディレクティブにnonceを追加
  const nonceValue = `'nonce-${nonce}'`;
  
  if (cspHeader.includes("style-src")) {
    return cspHeader.replace(
      /style-src\s+[^;]+/,
      `style-src 'self' 'unsafe-inline' ${nonceValue} data:`
    );
  } else {
    return `${cspHeader}; style-src 'self' 'unsafe-inline' ${nonceValue} data:`;
  }
};

/**
 * インラインスタイルにnonceを追加
 */
export const addNonceToInlineStyle = (style: string, nonce: string): string => {
  return `style="${style}" nonce="${nonce}"`;
};

/**
 * Material-UIコンポーネント用のnonce設定
 */
export const getMaterialUINonceConfig = (nonce: string) => {
  return {
    nonce,
    key: 'mui',
  };
};
