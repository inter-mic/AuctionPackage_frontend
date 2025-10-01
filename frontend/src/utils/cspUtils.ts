/**
 * Content Security Policy設定のユーティリティ
 */

interface CSPConfig {
  isProduction: boolean;
  isHttps: boolean;
  reportUri?: string;
  nonce?: string;
}

/**
 * 環境に応じたCSP設定を生成
 */
export const generateCSP = (config: CSPConfig): string => {
  const {
    isProduction,
    isHttps,
    reportUri = '/api/security/csp-report',
    nonce
  } = config;

  const directives: string[] = [];

  // 基本設定
  directives.push("default-src 'self'");

  // スクリプト設定
  if (nonce) {
    directives.push(`script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com`);
  } else {
    directives.push("script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com");
  }

  // スタイル設定
  if (nonce) {
    directives.push(`style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`);
  } else {
    directives.push("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net");
  }

  // フォント設定
  directives.push("font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net");

  // 画像・メディア設定
  directives.push("img-src 'self' data: https: blob:");
  directives.push("media-src 'self' data: https: blob:");

  // セキュリティ設定
  directives.push("object-src 'none'");
  directives.push("base-uri 'self'");
  directives.push("form-action 'self'");
  directives.push("frame-ancestors 'none'");

  // 接続設定
  if (isProduction && isHttps) {
    directives.push("connect-src 'self' https: wss:");
  } else {
    directives.push("connect-src 'self' https: wss: http:");
  }

  // その他の設定
  directives.push("worker-src 'self' blob:");
  directives.push("manifest-src 'self'");

  // 本番環境での追加設定
  if (isProduction && isHttps) {
    directives.push("upgrade-insecure-requests");
    directives.push("block-all-mixed-content");
  }

  // レポート設定
  if (reportUri) {
    directives.push(`report-uri ${reportUri}`);
  }

  return directives.join('; ');
};

/**
 * 厳格なCSP設定（本番環境用）
 */
export const generateStrictCSP = (nonce?: string): string => {
  return generateCSP({
    isProduction: true,
    isHttps: true,
    nonce
  });
};

/**
 * 開発用CSP設定
 */
export const generateDevelopmentCSP = (): string => {
  return generateCSP({
    isProduction: false,
    isHttps: false
  });
};

/**
 * ランダムなnonce値を生成
 */
export const generateNonce = (): string => {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
};

/**
 * CSP設定の検証
 */
export const validateCSP = (csp: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 基本的な検証
  if (!csp.includes("default-src")) {
    errors.push("default-src directive is required");
  }
  
  if (!csp.includes("script-src")) {
    errors.push("script-src directive is required");
  }
  
  if (!csp.includes("object-src 'none'")) {
    errors.push("object-src 'none' is recommended for security");
  }
  
  if (!csp.includes("base-uri 'self'")) {
    errors.push("base-uri 'self' is recommended for security");
  }
  
  if (!csp.includes("form-action 'self'")) {
    errors.push("form-action 'self' is recommended for security");
  }
  
  if (!csp.includes("frame-ancestors")) {
    errors.push("frame-ancestors directive is recommended for security");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

