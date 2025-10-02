/**
 * AWS Application Load Balancer (ALB) クッキー管理のユーティリティ
 * ALBが設定するクッキーにSecure属性を追加する
 */

export interface AWSALBCookieOptions {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
}

/**
 * AWS ALBクッキーのデフォルトオプション
 */
export const getAWSALBCookieOptions = (): AWSALBCookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = process.env.NEXT_PUBLIC_HTTPS === 'true' || 
                  (typeof window !== 'undefined' && window.location.protocol === 'https:');

  return {
    secure: isProduction || isHttps, // 本番環境またはHTTPS環境ではSecure属性を有効
    httpOnly: false, // AWS ALBクッキーはHttpOnly属性を設定しない（ロードバランサーの管理のため）
    sameSite: 'strict', // CSRF攻撃を防ぐためSameSite属性をstrictに設定
    path: '/',
  };
};

/**
 * AWS ALBクッキー名の定義
 */
export const AWS_ALB_COOKIE_NAMES = [
  'AWSALB',
  'AWSALBCORS',
] as const;

/**
 * AWS ALBクッキーかどうかを判定
 */
export const isAWSALBCookie = (cookieName: string): boolean => {
  return AWS_ALB_COOKIE_NAMES.includes(cookieName as any);
};

/**
 * AWS ALBクッキーをセキュアな形式に変換
 */
export const convertAWSALBCookieToSecure = (
  cookieName: string,
  cookieValue: string,
  options: AWSALBCookieOptions = getAWSALBCookieOptions()
): string => {
  if (!isAWSALBCookie(cookieName)) {
    throw new Error(`Invalid AWS ALB cookie name: ${cookieName}`);
  }

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

  return parts.join('; ');
};

/**
 * AWS ALBクッキーの検証
 */
export const validateAWSALBCookie = (cookieString: string): {
  hasSecure: boolean;
  hasHttpOnly: boolean;
  hasSameSite: boolean;
  isSecure: boolean;
  recommendations: string[];
} => {
  const hasSecure = cookieString.includes('Secure');
  const hasHttpOnly = cookieString.includes('HttpOnly');
  const hasSameSite = cookieString.includes('SameSite=');
  const isSecure = hasSecure && hasHttpOnly && hasSameSite;

  const recommendations: string[] = [];

  if (!hasSecure) {
    recommendations.push('AWS ALBクッキーにSecure属性を追加してください');
  }

  if (!hasHttpOnly) {
    recommendations.push('AWS ALBクッキーにHttpOnly属性を追加してください');
  }

  if (!hasSameSite) {
    recommendations.push('AWS ALBクッキーにSameSite属性を追加してください');
  }

  return {
    hasSecure,
    hasHttpOnly,
    hasSameSite,
    isSecure,
    recommendations,
  };
};

/**
 * AWS ALBクッキーの移行処理
 */
export const migrateAWSALBCookies = (
  existingCookies: Record<string, string>,
  options: AWSALBCookieOptions = getAWSALBCookieOptions()
): string[] => {
  const secureCookies: string[] = [];

  AWS_ALB_COOKIE_NAMES.forEach(cookieName => {
    const cookieValue = existingCookies[cookieName];
    if (cookieValue) {
      try {
        const secureCookie = convertAWSALBCookieToSecure(cookieName, cookieValue, options);
        secureCookies.push(secureCookie);
      } catch (error) {
        console.warn(`Failed to convert AWS ALB cookie ${cookieName}:`, error);
      }
    }
  });

  return secureCookies;
};
