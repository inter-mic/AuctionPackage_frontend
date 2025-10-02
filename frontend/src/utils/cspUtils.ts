/**
 * Content-Security-Policy (CSP) 設定のユーティリティ
 * クロスサイトスクリプティング攻撃を防止するためのCSPヘッダー管理
 */

export interface CSPDirective {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'frame-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'manifest-src'?: string[];
  'worker-src'?: string[];
  'child-src'?: string[];
  'frame-ancestors'?: string[];
  'form-action'?: string[];
  'base-uri'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
}

export interface CSPConfig {
  directives: CSPDirective;
  reportUri?: string;
  reportOnly?: boolean;
}

/**
 * デフォルトのCSP設定
 */
export const getDefaultCSPConfig = (): CSPConfig => {
  // 開発環境用のAPI接続先を取得
  const apiUrls = [
    "'self'",
    "http://localhost:8080",
    "https://localhost:8080",
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_MEMBER_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_PUBLIC_API_URL,
  ].filter((url): url is string => Boolean(url)); // undefinedを除外し、型を保証

  return {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 開発環境用
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "data:"],
      'connect-src': apiUrls,
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'child-src': ["'self'"],
      'frame-ancestors': ["'self'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true,
    },
    reportUri: '/api/security/csp-report',
    reportOnly: false,
  };
};

/**
 * 本番環境用の厳格なCSP設定
 */
export const getProductionCSPConfig = (): CSPConfig => {
  // 本番環境用のAPI接続先を取得
  const apiUrls = [
    "'self'",
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_MEMBER_API_URL,
    process.env.NEXT_PUBLIC_ADMIN_API_URL,
    process.env.NEXT_PUBLIC_PUBLIC_API_URL,
  ].filter((url): url is string => Boolean(url)); // undefinedを除外し、型を保証

  return {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"], // 本番環境ではunsafe-inlineを削除
      'style-src': ["'self'"], // 本番環境ではunsafe-inlineを削除
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "data:"],
      'connect-src': apiUrls,
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'child-src': ["'self'"],
      'frame-ancestors': ["'self'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true,
    },
    reportUri: '/api/security/csp-report',
    reportOnly: false,
  };
};

/**
 * CSPディレクティブを文字列に変換
 */
export const formatCSPDirective = (directives: CSPDirective): string => {
  const parts: string[] = [];

  Object.entries(directives).forEach(([directive, values]) => {
    if (values === true) {
      parts.push(directive);
    } else if (Array.isArray(values) && values.length > 0) {
      parts.push(`${directive} ${values.join(' ')}`);
    }
  });

  return parts.join('; ');
};

/**
 * CSPヘッダーを生成
 */
export const generateCSPHeader = (config: CSPConfig = getDefaultCSPConfig()): string => {
  const directiveString = formatCSPDirective(config.directives);
  const reportUri = config.reportUri ? `; report-uri ${config.reportUri}` : '';
  
  return `Content-Security-Policy: ${directiveString}${reportUri}`;
};

/**
 * CSPレポート専用のヘッダーを生成
 */
export const generateCSPReportOnlyHeader = (config: CSPConfig = getDefaultCSPConfig()): string => {
  const directiveString = formatCSPDirective(config.directives);
  const reportUri = config.reportUri ? `; report-uri ${config.reportUri}` : '';
  
  return `Content-Security-Policy-Report-Only: ${directiveString}${reportUri}`;
};

/**
 * ページタイプに基づくCSP設定
 */
export const getCSPConfigForPath = (pathname: string): CSPConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseConfig = isProduction ? getProductionCSPConfig() : getDefaultCSPConfig();

  // 管理者ページ用の厳格な設定
  if (pathname.startsWith('/admin')) {
    return {
      ...baseConfig,
      directives: {
        ...baseConfig.directives,
        'frame-ancestors': ["'none'"], // 管理者ページは完全にフレーム内表示を禁止
        'script-src': ["'self'"], // 管理者ページではunsafe-inlineを禁止
        'style-src': ["'self'"], // 管理者ページではunsafe-inlineを禁止
      },
    };
  }

  // 会員ページ用の設定
  if (pathname.startsWith('/member')) {
    return {
      ...baseConfig,
      directives: {
        ...baseConfig.directives,
        'frame-ancestors': ["'self'"], // 会員ページは同一オリジンのみ許可
      },
    };
  }

  return baseConfig;
};

/**
 * CSP違反の検証
 */
export const validateCSPViolation = (report: any): {
  isValid: boolean;
  violations: string[];
  recommendations: string[];
} => {
  const violations: string[] = [];
  const recommendations: string[] = [];

  if (report['blocked-uri']) {
    violations.push(`Blocked resource: ${report['blocked-uri']}`);
    recommendations.push(`Add ${report['blocked-uri']} to the appropriate CSP directive`);
  }

  if (report['violated-directive']) {
    violations.push(`Violated directive: ${report['violated-directive']}`);
  }

  const isValid = violations.length === 0;

  return {
    isValid,
    violations,
    recommendations,
  };
};
