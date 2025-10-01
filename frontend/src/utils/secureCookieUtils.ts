/**
 * セキュアなCookie設定のためのユーティリティ関数
 * HttpOnly、Secure、SameSite属性を含む包括的なセキュリティ設定
 */

interface SecureCookieOptions {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

/**
 * セキュアなCookieオプションを取得
 * 本番環境ではSecure属性を有効にし、開発環境では無効にする
 */
export const getSecureCookieOptions = (): SecureCookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  return {
    secure: isProduction || isHttps, // 本番環境またはHTTPS環境ではSecure属性を有効
    httpOnly: true, // XSS攻撃を防ぐためHttpOnly属性を有効
    sameSite: 'strict', // CSRF攻撃を防ぐためSameSite属性をstrictに設定
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: '/',
  };
};

/**
 * セキュアなCookieの文字列を生成
 * HttpOnly属性を必須で設定
 */
export const generateSecureCookieString = (name: string, value: string, options: SecureCookieOptions = {}): string => {
  const defaultOptions = getSecureCookieOptions();
  const cookieOptions = { ...defaultOptions, ...options };
  
  // HttpOnly属性は必須
  if (!cookieOptions.httpOnly) {
    throw new Error('HttpOnly属性は必須です。セキュリティ上の理由でHttpOnly属性なしのCookieは許可されません。');
  }
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (cookieOptions.maxAge) {
    cookieString += `; Max-Age=${cookieOptions.maxAge}`;
  }
  
  if (cookieOptions.path) {
    cookieString += `; Path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.domain) {
    cookieString += `; Domain=${cookieOptions.domain}`;
  }
  
  if (cookieOptions.secure) {
    cookieString += '; Secure';
  }
  
  // HttpOnly属性は必須
  cookieString += '; HttpOnly';
  
  if (cookieOptions.sameSite) {
    cookieString += `; SameSite=${cookieOptions.sameSite}`;
  }
  
  return cookieString;
};

/**
 * セッションCookieの設定（HttpOnly属性付き）
 */
export const setSecureSessionCookie = (name: string, value: string): string => {
  return generateSecureCookieString(name, value, {
    maxAge: 60 * 60 * 24 * 7, // 7日間
    httpOnly: true, // 必須
  });
};

/**
 * 一時的なCookieの設定（例：認証トークン）（HttpOnly属性付き）
 */
export const setSecureTemporaryCookie = (name: string, value: string, maxAgeMinutes: number = 30): string => {
  return generateSecureCookieString(name, value, {
    maxAge: maxAgeMinutes * 60,
    httpOnly: true, // 必須
  });
};

/**
 * セキュアなセッションID Cookieの設定
 * HttpOnly属性を使用してセキュリティを最大化
 */
export const setSecureSessionId = (sessionId: string): string => {
  return generateSecureCookieString('sessionId', sessionId, {
    maxAge: 60 * 60 * 24 * 7, // 7日間
    secure: true, // HTTPS必須
    httpOnly: true, // XSS攻撃防止（必須）
    sameSite: 'strict', // CSRF攻撃防止
  });
};

/**
 * 認証トークンCookieの設定
 * HttpOnly属性を使用してセキュリティを最大化
 */
export const setSecureAuthToken = (token: string, maxAgeMinutes: number = 30): string => {
  return generateSecureCookieString('authToken', token, {
    maxAge: maxAgeMinutes * 60,
    secure: true, // HTTPS必須
    httpOnly: true, // XSS攻撃防止（必須）
    sameSite: 'strict', // CSRF攻撃防止
  });
};

/**
 * ユーザー情報Cookieの設定（HttpOnly属性付き）
 */
export const setSecureUserCookie = (userId: string, userName: string): string => {
  const userData = JSON.stringify({ userId, userName });
  return generateSecureCookieString('userInfo', userData, {
    maxAge: 60 * 60 * 24 * 7, // 7日間
    secure: true,
    httpOnly: true, // 必須
    sameSite: 'strict',
  });
};

/**
 * Cookie設定のセキュリティ検証
 */
export const validateCookieSecurity = (cookieString: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!cookieString.includes('HttpOnly')) {
    errors.push('HttpOnly属性が設定されていません。XSS攻撃からCookieを保護するために必須です。');
  }
  
  if (!cookieString.includes('Secure')) {
    errors.push('Secure属性が設定されていません。HTTPS通信時のみCookieを送信するために推奨されます。');
  }
  
  if (!cookieString.includes('SameSite')) {
    errors.push('SameSite属性が設定されていません。CSRF攻撃を防ぐために推奨されます。');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
