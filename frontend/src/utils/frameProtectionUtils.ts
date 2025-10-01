/**
 * フレーム保護のためのユーティリティ関数
 * X-Frame-Optionsヘッダーの設定と検証
 */

export interface FrameProtectionOptions {
  allowSameOrigin?: boolean;
  allowSpecificOrigins?: string[];
  denyAll?: boolean;
}

/**
 * ページタイプに応じたX-Frame-Optionsヘッダー値を生成
 */
export const getFrameOptionsHeader = (
  pathname: string,
  options: FrameProtectionOptions = {}
): string => {
  const isAdminPage = pathname.startsWith('/admin');
  const isMemberPage = pathname.startsWith('/member');
  const isApiRoute = pathname.startsWith('/api');
  
  // APIルートはフレーム保護を適用しない
  if (isApiRoute) {
    return '';
  }
  
  // 管理者ページと会員ページは完全にフレーム埋め込みを禁止
  if (isAdminPage || isMemberPage) {
    return 'DENY';
  }
  
  // 公開ページは同一オリジンのみ許可
  if (options.allowSameOrigin) {
    return 'SAMEORIGIN';
  }
  
  // 特定のオリジンのみ許可
  if (options.allowSpecificOrigins && options.allowSpecificOrigins.length > 0) {
    return `ALLOW-FROM ${options.allowSpecificOrigins.join(' ')}`;
  }
  
  // デフォルトは同一オリジンのみ許可
  return 'SAMEORIGIN';
};

/**
 * CSPのframe-ancestorsディレクティブを生成
 */
export const getFrameAncestorsDirective = (
  pathname: string,
  options: FrameProtectionOptions = {}
): string => {
  const isAdminPage = pathname.startsWith('/admin');
  const isMemberPage = pathname.startsWith('/member');
  const isApiRoute = pathname.startsWith('/api');
  
  // APIルートはフレーム保護を適用しない
  if (isApiRoute) {
    return '';
  }
  
  // 管理者ページと会員ページは完全にフレーム埋め込みを禁止
  if (isAdminPage || isMemberPage) {
    return "frame-ancestors 'none'";
  }
  
  // 公開ページは同一オリジンのみ許可
  if (options.allowSameOrigin) {
    return "frame-ancestors 'self'";
  }
  
  // 特定のオリジンのみ許可
  if (options.allowSpecificOrigins && options.allowSpecificOrigins.length > 0) {
    return `frame-ancestors 'self' ${options.allowSpecificOrigins.join(' ')}`;
  }
  
  // デフォルトは同一オリジンのみ許可
  return "frame-ancestors 'self'";
};

/**
 * フレーム保護の設定を検証
 */
export const validateFrameProtection = (
  xFrameOptions: string,
  frameAncestors: string
): { valid: boolean; warnings: string[]; errors: string[] } => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // X-Frame-Optionsヘッダーの検証
  if (!xFrameOptions) {
    errors.push('X-Frame-Optionsヘッダーが設定されていません。クリックジャッキング攻撃のリスクがあります。');
  } else if (xFrameOptions === 'ALLOWALL') {
    errors.push('X-Frame-Options: ALLOWALLは危険です。任意のサイトからフレーム埋め込みが可能になります。');
  } else if (xFrameOptions === 'SAMEORIGIN') {
    warnings.push('X-Frame-Options: SAMEORIGINが設定されています。同一オリジンからのフレーム埋め込みが許可されます。');
  } else if (xFrameOptions === 'DENY') {
    // これは安全な設定
  } else if (xFrameOptions.startsWith('ALLOW-FROM')) {
    warnings.push('X-Frame-Options: ALLOW-FROMは非標準です。CSPのframe-ancestorsディレクティブの使用を推奨します。');
  }
  
  // CSPのframe-ancestorsディレクティブの検証
  if (!frameAncestors) {
    warnings.push('CSPのframe-ancestorsディレクティブが設定されていません。X-Frame-Optionsと併用することを推奨します。');
  } else if (frameAncestors.includes("'none'")) {
    // これは安全な設定
  } else if (frameAncestors.includes("'self'")) {
    warnings.push('CSPのframe-ancestors: \'self\'が設定されています。同一オリジンからのフレーム埋め込みが許可されます。');
  } else if (frameAncestors.includes('*')) {
    errors.push('CSPのframe-ancestors: *は危険です。任意のサイトからフレーム埋め込みが可能になります。');
  }
  
  // 設定の一貫性チェック
  if (xFrameOptions === 'DENY' && !frameAncestors.includes("'none'")) {
    warnings.push('X-Frame-Options: DENYとCSPのframe-ancestors設定が一致していません。');
  }
  
  if (xFrameOptions === 'SAMEORIGIN' && !frameAncestors.includes("'self'")) {
    warnings.push('X-Frame-Options: SAMEORIGINとCSPのframe-ancestors設定が一致していません。');
  }
  
  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
};

/**
 * フレーム保護の推奨設定を取得
 */
export const getRecommendedFrameProtection = (pathname: string): {
  xFrameOptions: string;
  frameAncestors: string;
  description: string;
} => {
  const isAdminPage = pathname.startsWith('/admin');
  const isMemberPage = pathname.startsWith('/member');
  
  if (isAdminPage || isMemberPage) {
    return {
      xFrameOptions: 'DENY',
      frameAncestors: "frame-ancestors 'none'",
      description: '管理者・会員ページ: 完全にフレーム埋め込みを禁止'
    };
  } else {
    return {
      xFrameOptions: 'SAMEORIGIN',
      frameAncestors: "frame-ancestors 'self'",
      description: '公開ページ: 同一オリジンからのフレーム埋め込みのみ許可'
    };
  }
};
