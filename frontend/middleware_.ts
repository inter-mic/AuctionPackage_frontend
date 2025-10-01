import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダーの設定
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HTTPS環境でのみHSTSヘッダーを設定
  if (request.headers.get("x-forwarded-proto") === "https") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // セキュアなCookie移行処理（HttpOnly属性付き）
  const existingCookies = request.cookies.getAll();
  const cookieMap: Record<string, string> = {};

  existingCookies.forEach((cookie) => {
    cookieMap[cookie.name] = cookie.value;
  });

  // セッション関連のCookieが存在する場合にHttpOnly属性付きで移行
  const sessionCookies = ["sessionId", "authToken", "userId", "userName"];
  const needsMigration = sessionCookies.some((name) => cookieMap[name]);

  // 既存のCookieにHttpOnly属性がない場合の警告
  const hasInsecureCookies = existingCookies.some(
    (cookie) =>
      cookie.name.includes("session") ||
      cookie.name.includes("auth") ||
      cookie.name.includes("token")
  );

  if (hasInsecureCookies) {
    console.warn(
      "Insecure cookies detected. Consider migrating to HttpOnly cookies for better security."
    );
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
