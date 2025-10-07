/**
 * X-Frame-Optionsヘッダー設定のユーティリティ
 * クリックジャッキング攻撃を防止するためのフレーム保護機能
 */

export type FrameOptions = 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';

export interface FrameProtectionConfig {
  defaultPolicy: FrameOptions;
  adminPolicy: FrameOptions;
  memberPolicy: FrameOptions;
  publicPolicy: FrameOptions;
  allowedOrigins?: string[];
}

/**
 * デフォルトのフレーム保護設定
 */
export const getDefaultFrameProtectionConfig = (): FrameProtectionConfig => {
  return {
    defaultPolicy: 'SAMEORIGIN',
    adminPolicy: 'DENY', // 管理者ページは完全にフレーム内での表示を禁止
    memberPolicy: 'SAMEORIGIN', // 会員ページは同一オリジンのみ許可
    publicPolicy: 'SAMEORIGIN', // 公開ページは同一オリジンのみ許可
    allowedOrigins: [],
  };
};

/**
 * ページタイプに基づくX-Frame-Optionsヘッダーの値を決定
 */
export const getFrameOptionsForPath = (pathname: string): FrameOptions => {
  const config = getDefaultFrameProtectionConfig();
  
  // 管理者ページ
  if (pathname.startsWith('/admin')) {
    return config.adminPolicy;
  }
  
  // 会員ページ
  if (pathname.startsWith('/member')) {
    return config.memberPolicy;
  }
  
  // 公開ページ
  if (pathname.startsWith('/public') || pathname === '/' || pathname.startsWith('/goods')) {
    return config.publicPolicy;
  }
  
  // デフォルト
  return config.defaultPolicy;
};

/**
 * X-Frame-Optionsヘッダー値を生成
 */
export const generateXFrameOptionsHeader = (pathname: string): string => {
  const frameOption = getFrameOptionsForPath(pathname);
  
  if (frameOption === 'ALLOW-FROM') {
    const config = getDefaultFrameProtectionConfig();
    const allowedOrigin = config.allowedOrigins?.[0] || 'https://trusted-domain.com';
    return `X-Frame-Options: ${frameOption} ${allowedOrigin}`;
  }
  
  return `X-Frame-Options: ${frameOption}`;
};

/**
 * Content-Security-Policyのframe-ancestorsディレクティブを生成
 */
export const generateCSPFrameAncestors = (pathname: string): string => {
  const frameOption = getFrameOptionsForPath(pathname);
  
  switch (frameOption) {
    case 'DENY':
      return "frame-ancestors 'none'";
    case 'SAMEORIGIN':
      return "frame-ancestors 'self'";
    case 'ALLOW-FROM':
      const config = getDefaultFrameProtectionConfig();
      const allowedOrigin = config.allowedOrigins?.[0] || 'https://trusted-domain.com';
      return `frame-ancestors ${allowedOrigin}`;
    default:
      return "frame-ancestors 'self'";
  }
};

/**
 * フレーム保護の検証
 */
export const validateFrameProtection = (headers: Record<string, string>): {
  hasXFrameOptions: boolean;
  hasCSPFrameAncestors: boolean;
  isSecure: boolean;
  recommendations: string[];
} => {
  const hasXFrameOptions = 'x-frame-options' in headers;
  const hasCSPFrameAncestors = headers['content-security-policy']?.includes('frame-ancestors');
  
  const recommendations: string[] = [];
  
  if (!hasXFrameOptions) {
    recommendations.push('X-Frame-Optionsヘッダーを追加してください');
  }
  
  if (!hasCSPFrameAncestors) {
    recommendations.push('Content-Security-Policyのframe-ancestorsディレクティブを追加してください');
  }
  
  const isSecure = hasXFrameOptions && hasCSPFrameAncestors;
  
  return {
    hasXFrameOptions,
    hasCSPFrameAncestors,
    isSecure,
    recommendations,
  };
};

/**
 * フレーム保護のテスト用HTMLを生成
 */
export const generateFrameTestHTML = (targetUrl: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Frame Protection Test</title>
</head>
<body>
    <h1>Frame Protection Test</h1>
    <p>以下のiframeでページが読み込まれるかテストします:</p>
    <iframe src="${targetUrl}" width="800" height="600" style="border: 1px solid #ccc;"></iframe>
    <p>ページが読み込まれない場合は、X-Frame-Optionsヘッダーが正しく設定されています。</p>
</body>
</html>
  `;
};

