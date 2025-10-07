import { NextApiRequest, NextApiResponse } from 'next';
import { validateFrameProtection } from '@/utils/frameProtectionUtils';
import { validateSecurityHeaders } from '@/utils/securityHeadersUtils';

/**
 * セキュリティヘッダーの確認API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // レスポンスヘッダーを取得
    const headers: Record<string, string> = {};
    res.getHeaderNames().forEach(name => {
      const value = res.getHeader(name);
      if (typeof value === 'string') {
        headers[name.toLowerCase()] = value;
      }
    });

    // フレーム保護の検証
    const frameProtection = validateFrameProtection(headers);
    
    // 包括的なセキュリティヘッダーの検証
    const securityValidation = validateSecurityHeaders(headers);

    // セキュリティヘッダーの詳細情報
    const securityHeaders = {
      'X-Content-Type-Options': res.getHeader('X-Content-Type-Options') || 'Not Set',
      'X-XSS-Protection': res.getHeader('X-XSS-Protection') || 'Not Set',
      'X-Frame-Options': res.getHeader('X-Frame-Options') || 'Not Set',
      'Content-Security-Policy': res.getHeader('Content-Security-Policy') || 'Not Set',
      'Referrer-Policy': res.getHeader('Referrer-Policy') || 'Not Set',
      'Strict-Transport-Security': res.getHeader('Strict-Transport-Security') || 'Not Set',
    };

    // HttpOnly属性の検証
    const setCookieHeaders = res.getHeader('Set-Cookie');
    const httpOnlyValidation = {
      hasSetCookie: !!setCookieHeaders,
      hasHttpOnly: setCookieHeaders ? String(setCookieHeaders).includes('HttpOnly') : false,
      cookieCount: setCookieHeaders ? String(setCookieHeaders).split(';').length : 0,
    };

    return res.status(200).json({
      message: 'Security headers check completed',
      frameProtection,
      securityValidation,
      securityHeaders,
      httpOnlyValidation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Headers check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

