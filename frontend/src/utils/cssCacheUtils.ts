/**
 * CSSキャッシュ対策のためのユーティリティ
 */

/**
 * CSSファイルのキャッシュバスティング用のタイムスタンプを生成
 */
export const generateCacheBuster = (): string => {
  return `?v=${Date.now()}`;
};

/**
 * CSSファイルのURLにキャッシュバスターを追加
 */
export const addCacheBusterToCSS = (cssPath: string): string => {
  return `${cssPath}${generateCacheBuster()}`;
};

/**
 * 動的にCSSファイルを読み込む
 */
export const loadCSSWithCacheBuster = (cssPath: string): void => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = addCacheBusterToCSS(cssPath);
  link.type = 'text/css';
  
  // 既存の同じCSSファイルを削除
  const existingLink = document.querySelector(`link[href*="${cssPath}"]`);
  if (existingLink) {
    existingLink.remove();
  }
  
  document.head.appendChild(link);
};

/**
 * ページロード時にCSSキャッシュをクリア
 */
export const clearCSSCache = (): void => {
  // すべてのCSSファイルのリンクを取得
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
  
  cssLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.includes('?')) {
      // キャッシュバスターを追加
      link.setAttribute('href', addCacheBusterToCSS(href));
    }
  });
};

/**
 * 開発環境でのCSSキャッシュクリア
 */
export const devClearCSSCache = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // 開発環境では定期的にCSSキャッシュをクリア
    setInterval(() => {
      clearCSSCache();
    }, 30000); // 30秒ごと
  }
};
