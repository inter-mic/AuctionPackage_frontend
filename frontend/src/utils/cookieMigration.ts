/**
 * 既存のCookieから__Host-プレフィックス付きCookieへの移行処理
 */

interface CookieMigrationResult {
  success: boolean;
  migratedCookies: string[];
  errors: string[];
}

/**
 * 既存のCookieを__Host-プレフィックス付きに移行
 */
export const migrateToHostPrefixCookies = (existingCookies: Record<string, string>): CookieMigrationResult => {
  const migratedCookies: string[] = [];
  const errors: string[] = [];

  try {
    // セッション関連のCookieを移行
    const sessionCookies = ['sessionId', 'authToken', 'userId', 'userName'];
    
    for (const cookieName of sessionCookies) {
      if (existingCookies[cookieName]) {
        try {
          // 新しい__Host-プレフィックス付きCookieを生成
          const newCookieName = `__Host-${cookieName}`;
          const cookieValue = existingCookies[cookieName];
          
          // セキュアなCookie設定で生成
          const secureCookie = generateSecureCookie(newCookieName, cookieValue);
          migratedCookies.push(secureCookie);
          
        } catch (error) {
          errors.push(`Failed to migrate ${cookieName}: ${error}`);
        }
      }
    }

    return {
      success: errors.length === 0,
      migratedCookies,
      errors
    };

  } catch (error) {
    return {
      success: false,
      migratedCookies: [],
      errors: [`Migration failed: ${error}`]
    };
  }
};

/**
 * セキュアなCookieを生成
 */
const generateSecureCookie = (name: string, value: string): string => {
  const encodedValue = encodeURIComponent(value);
  return `${name}=${encodedValue}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=604800`;
};

/**
 * 古いCookieを削除するためのSet-Cookieヘッダーを生成
 */
export const generateCookieDeletionHeaders = (cookieNames: string[]): string[] => {
  return cookieNames.map(name => 
    `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`
  );
};

/**
 * Cookie移行のためのAPIレスポンスヘッダーを生成
 */
export const generateMigrationHeaders = (
  existingCookies: Record<string, string>,
  newCookies: Record<string, string>
): string[] => {
  const headers: string[] = [];
  
  // 新しい__Host-プレフィックス付きCookieを追加
  Object.entries(newCookies).forEach(([name, value]) => {
    const secureCookie = generateSecureCookie(`__Host-${name}`, value);
    headers.push(secureCookie);
  });
  
  // 古いCookieを削除
  Object.keys(existingCookies).forEach(name => {
    const deletionHeader = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
    headers.push(deletionHeader);
  });
  
  return headers;
};

/**
 * セキュアなCookie移行ヘッダーを生成（HttpOnly属性付き）
 */
export const generateSecureMigrationHeaders = (
  existingCookies: Record<string, string>
): string[] => {
  const headers: string[] = [];
  
  // セッション関連のCookieをHttpOnly属性付きで移行
  const sessionCookies = ['sessionId', 'authToken', 'userId', 'userName'];
  
  sessionCookies.forEach(name => {
    if (existingCookies[name]) {
      // 新しいHttpOnly Cookieを生成
      const secureCookie = generateSecureCookieWithHttpOnly(name, existingCookies[name]);
      headers.push(secureCookie);
      
      // 古いCookieを削除
      const deletionHeader = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly`;
      headers.push(deletionHeader);
    }
  });
  
  return headers;
};

/**
 * HttpOnly属性付きのセキュアなCookieを生成
 */
const generateSecureCookieWithHttpOnly = (name: string, value: string): string => {
  const encodedValue = encodeURIComponent(value);
  return `${name}=${encodedValue}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=604800`;
};



