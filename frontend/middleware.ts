import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateSecureMigrationHeaders } from './src/utils/cookieMigration';
import { getFrameOptionsHeader, getFrameAncestorsDirective } from './src/utils/frameProtectionUtils';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // HTTPSリダイレクト（本番環境のみ）
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${request.headers.get('host')}${request.nextUrl.pathname}`, 301);
  }
  
  // セキュリティヘッダーの設定
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // フレーム保護の強化
  const url = new URL(request.url);
  const frameOptions = getFrameOptionsHeader(url.pathname);
  
  if (frameOptions) {
    response.headers.set('X-Frame-Options', frameOptions);
  }
  
  // 環境に応じたCSP設定
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = request.headers.get('x-forwarded-proto') === 'https';
  
  // CSP設定（フレーム保護を含む）
  const frameAncestors = getFrameAncestorsDirective(url.pathname);
  
  if (isProduction && isHttps) {
    // 本番環境（HTTPS）での厳格なCSP設定
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: https: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      frameAncestors,
      "connect-src 'self' https: wss:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].filter(Boolean);
    
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  } else {
    // 開発環境での緩いCSP設定
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: https: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      frameAncestors,
      "connect-src 'self' https: wss: http:",
      "worker-src 'self' blob:",
      "manifest-src 'self'"
    ].filter(Boolean);
    
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  }
  
  // HTTPS環境でのみHSTSヘッダーを設定
  if (request.headers.get('x-forwarded-proto') === 'https') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // セキュアなCookie移行処理（HttpOnly属性付き）
  const existingCookies = request.cookies.getAll();
  const cookieMap: Record<string, string> = {};
  
  existingCookies.forEach(cookie => {
    cookieMap[cookie.name] = cookie.value;
  });
  
  // セッション関連のCookieが存在する場合にHttpOnly属性付きで移行
  const sessionCookies = ['sessionId', 'authToken', 'userId', 'userName'];
  const needsMigration = sessionCookies.some(name => 
    cookieMap[name]
  );
  
  if (needsMigration) {
    // HttpOnly属性付きのセキュアなCookieヘッダーを生成
    const secureMigrationHeaders = generateSecureMigrationHeaders(cookieMap);
    secureMigrationHeaders.forEach(header => {
      response.headers.append('Set-Cookie', header);
    });
  }
  
  // 既存のCookieにHttpOnly属性がない場合の警告
  const hasInsecureCookies = existingCookies.some(cookie => 
    (cookie.name.includes('session') || cookie.name.includes('auth') || cookie.name.includes('token'))
  );
  
  if (hasInsecureCookies) {
    console.warn('Insecure cookies detected. Consider migrating to HttpOnly cookies for better security.');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
