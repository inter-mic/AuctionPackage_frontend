/**
 * APIルート用のセキュリティヘッダー設定
 * すべてのAPIレスポンスにセキュリティヘッダーを適用
 */

import { NextApiResponse } from 'next';

/**
 * APIレスポンスにセキュリティヘッダーを設定
 */
export const setApiSecurityHeaders = (res: NextApiResponse): void => {
  // Cache-Controlヘッダーの設定（キャッシュ防止）
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // その他のセキュリティヘッダー
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
};

/**
 * セキュリティヘッダーの検証
 */
export const validateApiSecurityHeaders = (res: NextApiResponse): {
  hasCacheControl: boolean;
  hasXContentTypeOptions: boolean;
  hasXXSSProtection: boolean;
  hasReferrerPolicy: boolean;
  hasXFrameOptions: boolean;
  isSecure: boolean;
  missingHeaders: string[];
} => {
  const headers = res.getHeaders();
  
  const hasCacheControl = !!headers['cache-control'];
  const hasXContentTypeOptions = !!headers['x-content-type-options'];
  const hasXXSSProtection = !!headers['x-xss-protection'];
  const hasReferrerPolicy = !!headers['referrer-policy'];
  const hasXFrameOptions = !!headers['x-frame-options'];

  const isSecure = hasCacheControl && hasXContentTypeOptions && hasXXSSProtection && hasReferrerPolicy && hasXFrameOptions;

  const missingHeaders: string[] = [];
  if (!hasCacheControl) missingHeaders.push('Cache-Control');
  if (!hasXContentTypeOptions) missingHeaders.push('X-Content-Type-Options');
  if (!hasXXSSProtection) missingHeaders.push('X-XSS-Protection');
  if (!hasReferrerPolicy) missingHeaders.push('Referrer-Policy');
  if (!hasXFrameOptions) missingHeaders.push('X-Frame-Options');

  return {
    hasCacheControl,
    hasXContentTypeOptions,
    hasXXSSProtection,
    hasReferrerPolicy,
    hasXFrameOptions,
    isSecure,
    missingHeaders,
  };
};
