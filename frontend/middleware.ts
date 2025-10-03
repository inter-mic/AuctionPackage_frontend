import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSecureCookieOptions, validateCookieSecurity } from "@/utils/cookieUtils";
import { getFrameOptionsForPath, generateCSPFrameAncestors } from "@/utils/frameProtectionUtils";
import { generateSecurityHeaders } from "@/utils/securityHeadersUtils";
import { getCSPConfigForPath, generateCSPHeader } from "@/utils/cspUtils";


export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダーの設定
  const securityHeaders = generateSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // X-Frame-Optionsヘッダーの設定（クリックジャッキング攻撃防止）
  const frameOption = getFrameOptionsForPath(request.nextUrl.pathname);
  response.headers.set("X-Frame-Options", frameOption);
  
  // Content-Security-Policyの包括的な設定
  const cspConfig = getCSPConfigForPath(request.nextUrl.pathname);
  const cspHeader = generateCSPHeader(cspConfig);
  const cspValue = cspHeader.replace('Content-Security-Policy: ', '');
  response.headers.set("Content-Security-Policy", cspValue);

  // HTTPS環境でのみHSTSヘッダーを設定
  if (request.headers.get("x-forwarded-proto") === "https") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Cache-Controlヘッダーの設定（キャッシュ防止）
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // セキュアなクッキーの検証と移行処理
  const existingCookies = request.cookies.getAll();
  const cookieMap: Record<string, string> = {};

  existingCookies.forEach((cookie) => {
    cookieMap[cookie.name] = cookie.value;
  });

  // セッション関連のCookieが存在する場合にセキュア属性付きで移行
  const sessionCookies = ["sessionId", "authToken", "userId", "userName"];
  const needsMigration = sessionCookies.some((name) => cookieMap[name]);

  // AWS ALBクッキーを検出
  const awsAlbCookies = ["AWSALB", "AWSALBCORS"];
  const hasAwsAlbCookies = awsAlbCookies.some((name) => cookieMap[name]);

  // 既存のCookieにセキュア属性がない場合の警告と移行
  const hasInsecureCookies = existingCookies.some(
    (cookie) =>
      (cookie.name.includes("session") ||
       cookie.name.includes("auth") ||
       cookie.name.includes("token") ||
       awsAlbCookies.includes(cookie.name)) &&
      !cookie.name.includes("__Host-") // 既にセキュアなクッキーでない場合
  );

  if (hasInsecureCookies) {
    console.warn(
      "Insecure cookies detected. Migrating to secure cookies with Secure, HttpOnly, and SameSite attributes."
    );

    // セキュアなクッキーオプションを取得
    const secureOptions = getSecureCookieOptions();
    
    // セッション関連のクッキーをセキュア属性付きで再設定
    const secureCookies: string[] = [];
    
    // セッション関連クッキーの処理
    sessionCookies.forEach((cookieName) => {
      const cookieValue = cookieMap[cookieName];
      if (cookieValue) {
        const secureCookie = `${cookieName}=${cookieValue}; Secure; HttpOnly; SameSite=strict; Path=/`;
        secureCookies.push(secureCookie);
      }
    });


    if (secureCookies.length > 0) {
      // 複数のクッキーを個別に設定
      secureCookies.forEach(cookie => {
        response.headers.append("Set-Cookie", cookie);
      });
    }
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
