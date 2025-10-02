/**
 * セキュリティヘッダー管理のユーティリティ
 * MIMEスニッフィング攻撃やその他のセキュリティ脅威を防止
 */

export interface SecurityHeadersConfig {
  xContentTypeOptions: boolean;
  xFrameOptions: boolean;
  referrerPolicy: string;
  strictTransportSecurity: boolean;
  contentSecurityPolicy: boolean;
  xXSSProtection: boolean;
  httpOnlyCookies: boolean;
  cacheControl: boolean;
}

/**
 * デフォルトのセキュリティヘッダー設定
 */
export const getDefaultSecurityHeadersConfig = (): SecurityHeadersConfig => {
  return {
    xContentTypeOptions: true,
    xFrameOptions: true,
    referrerPolicy: 'no-referrer', // 機微情報の漏洩を防止
    strictTransportSecurity: true,
    contentSecurityPolicy: true,
    xXSSProtection: true,
    httpOnlyCookies: true,
    cacheControl: true, // キャッシュ防止
  };
};

/**
 * X-Content-Type-Optionsヘッダーの設定
 * MIMEスニッフィング攻撃を防止
 */
export const getXContentTypeOptionsHeader = (): string => {
  return 'nosniff';
};

/**
 * X-XSS-Protectionヘッダーの設定
 * XSS攻撃の検出とブロックを有効化
 */
export const getXXSSProtectionHeader = (): string => {
  return '1; mode=block';
};

/**
 * Cache-Controlヘッダーの設定
 * キャッシュを防止して情報漏洩を防ぐ
 */
export const getCacheControlHeader = (): string => {
  return 'no-store, no-cache, must-revalidate, proxy-revalidate';
};

/**
 * 包括的なセキュリティヘッダーの生成
 */
export const generateSecurityHeaders = (config: SecurityHeadersConfig = getDefaultSecurityHeadersConfig()) => {
  const headers: Record<string, string> = {};

  // X-Content-Type-Options: nosniff
  // MIMEスニッフィング攻撃を防止
  if (config.xContentTypeOptions) {
    headers['X-Content-Type-Options'] = getXContentTypeOptionsHeader();
  }

  // X-XSS-Protection: 1; mode=block
  // XSS攻撃の検出とブロック
  if (config.xXSSProtection) {
    headers['X-XSS-Protection'] = getXXSSProtectionHeader();
  }

  // Referrer-Policy: no-referrer
  // 機微情報の漏洩を防止（リファラー情報を一切送信しない）
  if (config.referrerPolicy) {
    headers['Referrer-Policy'] = config.referrerPolicy;
  }

  // Cache-Control: no-store
  // キャッシュを防止して情報漏洩を防ぐ
  if (config.cacheControl) {
    headers['Cache-Control'] = getCacheControlHeader();
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  }

  return headers;
};

/**
 * MIMEスニッフィング攻撃の検証
 */
export const validateMIMESniffingProtection = (headers: Record<string, string>): {
  hasXContentTypeOptions: boolean;
  isCorrectValue: boolean;
  isSecure: boolean;
  recommendations: string[];
} => {
  const xContentTypeOptions = headers['x-content-type-options'];
  const hasXContentTypeOptions = !!xContentTypeOptions;
  const isCorrectValue = xContentTypeOptions === 'nosniff';
  const isSecure = hasXContentTypeOptions && isCorrectValue;

  const recommendations: string[] = [];

  if (!hasXContentTypeOptions) {
    recommendations.push('X-Content-Type-Optionsヘッダーを追加してください');
  } else if (!isCorrectValue) {
    recommendations.push('X-Content-Type-Optionsヘッダーの値を「nosniff」に設定してください');
  }

  return {
    hasXContentTypeOptions,
    isCorrectValue,
    isSecure,
    recommendations,
  };
};

/**
 * セキュリティヘッダーの包括的な検証
 */
export const validateSecurityHeaders = (headers: Record<string, string>): {
  mimeSniffing: ReturnType<typeof validateMIMESniffingProtection>;
  xssProtection: boolean;
  frameProtection: boolean;
  referrerPolicy: boolean;
  cacheControl: boolean;
  overallSecurity: boolean;
  allRecommendations: string[];
} => {
  const mimeSniffing = validateMIMESniffingProtection(headers);
  const xssProtection = headers['x-xss-protection'] === '1; mode=block';
  const frameProtection = !!headers['x-frame-options'];
  const referrerPolicy = !!headers['referrer-policy'];
  const cacheControl = headers['cache-control']?.includes('no-store') || false;

  const overallSecurity = mimeSniffing.isSecure && xssProtection && frameProtection && referrerPolicy && cacheControl;

  const allRecommendations = [
    ...mimeSniffing.recommendations,
    ...(xssProtection ? [] : ['X-XSS-Protectionヘッダーを追加してください']),
    ...(frameProtection ? [] : ['X-Frame-Optionsヘッダーを追加してください']),
    ...(referrerPolicy ? [] : ['Referrer-Policyヘッダーを追加してください']),
    ...(cacheControl ? [] : ['Cache-Controlヘッダーにno-storeを追加してください']),
  ];

  return {
    mimeSniffing,
    xssProtection,
    frameProtection,
    referrerPolicy,
    cacheControl,
    overallSecurity,
    allRecommendations,
  };
};

/**
 * MIMEスニッフィング攻撃のテスト用HTMLを生成
 */
export const generateMIMESniffingTestHTML = (): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>MIME Sniffing Test</title>
</head>
<body>
    <h1>MIME Sniffing Protection Test</h1>
    <p>以下のテストでMIMEスニッフィング攻撃の防止を確認します:</p>
    
    <h2>1. JavaScriptファイルの偽装テスト</h2>
    <script>
        // このスクリプトが実行されるかテスト
        document.getElementById('test-result').innerHTML = 'MIMEスニッフィング攻撃が成功しました';
    </script>
    <div id="test-result">MIMEスニッフィング攻撃は防止されています</div>
    
    <h2>2. 画像ファイルの偽装テスト</h2>
    <img src="data:text/html,<script>alert('XSS')</script>" alt="Test Image" onerror="alert('MIMEスニッフィング攻撃が成功しました')">
    
    <h2>3. CSSファイルの偽装テスト</h2>
    <style>
        body { background: red; }
    </style>
    <link rel="stylesheet" href="data:text/html,<script>alert('XSS')</script>">
    
    <p>X-Content-Type-Options: nosniff が正しく設定されていれば、上記の攻撃は防止されます。</p>
</body>
</html>
  `;
};
