/**
 * AWS ALBクッキーの代替処理
 * AWS ALBクッキーを削除して、アプリケーション側でセキュアなクッキーを設定
 */

export interface ALBReplacementOptions {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
  maxAge?: number;
}

/**
 * AWS ALBクッキーの代替設定
 */
export const getALBReplacementOptions = (): ALBReplacementOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = process.env.NEXT_PUBLIC_HTTPS === 'true' || 
                  (typeof window !== 'undefined' && window.location.protocol === 'https:');

  return {
    secure: isProduction || isHttps,
    httpOnly: true, // アプリケーション側のクッキーはHttpOnly属性を設定
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7日間
  };
};

/**
 * AWS ALBクッキーを削除するSet-Cookieヘッダーを生成
 */
export const generateALBCookieDeletion = (cookieName: string): string => {
  return `${cookieName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
};

/**
 * セキュアなセッションクッキーを生成
 */
export const generateSecureSessionCookie = (
  cookieName: string,
  cookieValue: string,
  options: ALBReplacementOptions = getALBReplacementOptions()
): string => {
  const parts: string[] = [`${cookieName}=${cookieValue}`];

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.maxAge) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  return parts.join('; ');
};

/**
 * AWS ALBクッキーの代替処理
 */
export const replaceAWSALBCookies = (
  existingCookies: Record<string, string>
): {
  deletionCookies: string[];
  replacementCookies: string[];
} => {
  const deletionCookies: string[] = [];
  const replacementCookies: string[] = [];

  // AWS ALBクッキーを削除
  const awsAlbCookies = ['AWSALB', 'AWSALBCORS'];
  awsAlbCookies.forEach(cookieName => {
    if (existingCookies[cookieName]) {
      deletionCookies.push(generateALBCookieDeletion(cookieName));
    }
  });

  // セキュアなセッションクッキーを生成
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  replacementCookies.push(generateSecureSessionCookie('secureSessionId', sessionId));

  return {
    deletionCookies,
    replacementCookies,
  };
};
