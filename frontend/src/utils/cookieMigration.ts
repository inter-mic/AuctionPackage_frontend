/**
 * クッキー移行ユーティリティ
 * 既存の非セキュアなクッキーをセキュアなクッキーに移行する
 */

import { getSecureCookieOptions, formatCookieHeader } from './cookieUtils';

export interface CookieMigrationOptions {
  forceMigration?: boolean;
  preserveValues?: boolean;
}

/**
 * 非セキュアなクッキーを検出
 */
export const detectInsecureCookies = (cookieString: string): string[] => {
  const insecureCookies: string[] = [];
  const cookies = cookieString.split(';');

  cookies.forEach(cookie => {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie && !trimmedCookie.includes('Secure') && !trimmedCookie.includes('HttpOnly')) {
      insecureCookies.push(trimmedCookie);
    }
  });

  return insecureCookies;
};

/**
 * セッション関連のクッキーをセキュアな形式に移行
 */
export const migrateSessionCookies = (
  existingCookies: Record<string, string>,
  options: CookieMigrationOptions = {}
): string[] => {
  const secureCookies: string[] = [];
  const sessionCookieNames = ['sessionId', 'authToken', 'userId', 'userName', 'JSESSIONID'];

  sessionCookieNames.forEach(cookieName => {
    const cookieValue = existingCookies[cookieName];
    if (cookieValue) {
      const secureOptions = getSecureCookieOptions();
      const secureCookie = formatCookieHeader(cookieName, cookieValue, secureOptions);
      secureCookies.push(secureCookie);
    }
  });

  return secureCookies;
};

/**
 * クッキー移行の実行
 */
export const executeCookieMigration = (
  existingCookies: Record<string, string>,
  options: CookieMigrationOptions = {}
): {
  migratedCookies: string[];
  needsMigration: boolean;
  migrationSummary: {
    totalCookies: number;
    migratedCookies: number;
    secureCookies: number;
  };
} => {
  const sessionCookieNames = ['sessionId', 'authToken', 'userId', 'userName', 'JSESSIONID'];
  const totalCookies = Object.keys(existingCookies).length;
  
  const needsMigration = sessionCookieNames.some(name => existingCookies[name]);
  
  if (!needsMigration && !options.forceMigration) {
    return {
      migratedCookies: [],
      needsMigration: false,
      migrationSummary: {
        totalCookies,
        migratedCookies: 0,
        secureCookies: totalCookies,
      },
    };
  }

  const migratedCookies = migrateSessionCookies(existingCookies, options);
  const secureCookies = totalCookies - migratedCookies.length;

  return {
    migratedCookies,
    needsMigration: true,
    migrationSummary: {
      totalCookies,
      migratedCookies: migratedCookies.length,
      secureCookies,
    },
  };
};

/**
 * クッキー移行の検証
 */
export const validateCookieMigration = (cookieHeaders: string[]): boolean => {
  return cookieHeaders.every(header => {
    return header.includes('Secure') && 
           header.includes('HttpOnly') && 
           header.includes('SameSite=');
  });
};
