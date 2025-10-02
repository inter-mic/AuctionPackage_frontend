/**
 * セキュアなクッキー設定のユーティリティ
 */

export interface CookieOptions {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

/**
 * セキュアなクッキー設定のデフォルトオプション
 */
export const getSecureCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = process.env.NEXT_PUBLIC_HTTPS === 'true' || 
                  (typeof window !== 'undefined' && window.location.protocol === 'https:');

  return {
    secure: isProduction || isHttps, // 本番環境またはHTTPS環境ではSecure属性を有効
    httpOnly: true, // XSS攻撃を防ぐためHttpOnly属性を有効（JavaScriptからのアクセスを禁止）
    sameSite: 'strict', // CSRF攻撃を防ぐためSameSite属性をstrictに設定
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: '/',
  };
};

/**
 * セッション用のセキュアなクッキーオプション
 */
export const getSessionCookieOptions = (): CookieOptions => {
  return {
    ...getSecureCookieOptions(),
    maxAge: 60 * 60 * 24, // セッションは1日間
  };
};

/**
 * 認証トークン用のセキュアなクッキーオプション
 */
export const getAuthTokenCookieOptions = (): CookieOptions => {
  return {
    ...getSecureCookieOptions(),
    maxAge: 60 * 60 * 24 * 30, // 認証トークンは30日間
  };
};

/**
 * クッキーオプションをSet-Cookieヘッダー用の文字列に変換
 */
export const formatCookieHeader = (name: string, value: string, options: CookieOptions): string => {
  const parts: string[] = [`${name}=${value}`];

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  return parts.join('; ');
};

/**
 * セキュアなクッキー設定の検証
 */
export const validateCookieSecurity = (cookieString: string): boolean => {
  const hasSecure = cookieString.includes('Secure');
  const hasHttpOnly = cookieString.includes('HttpOnly');
  const hasSameSite = cookieString.includes('SameSite=');

  return hasSecure && hasHttpOnly && hasSameSite;
};
