import { NextApiRequest, NextApiResponse } from 'next';
import { 
  setSecureSessionId, 
  setSecureAuthToken, 
  setSecureUserCookie,
  validateCookieSecurity 
} from '@/utils/secureCookieUtils';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, userName } = req.body;
    
    if (!userId || !userName) {
      return res.status(400).json({ error: 'User ID and User Name are required' });
    }

    // セキュアなセッションIDを生成
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // セキュアな認証トークンを生成
    const authToken = crypto.randomBytes(32).toString('hex');

    // HttpOnly属性付きのセキュアなCookieを設定
    const sessionCookie = setSecureSessionId(sessionId);
    const authCookie = setSecureAuthToken(authToken, 30); // 30分間有効
    const userCookie = setSecureUserCookie(userId, userName);

    // Cookie設定のセキュリティ検証
    const sessionValidation = validateCookieSecurity(sessionCookie);
    const authValidation = validateCookieSecurity(authCookie);
    const userValidation = validateCookieSecurity(userCookie);

    if (!sessionValidation.valid || !authValidation.valid || !userValidation.valid) {
      console.error('Cookie security validation failed:', {
        session: sessionValidation.errors,
        auth: authValidation.errors,
        user: userValidation.errors
      });
      return res.status(500).json({ error: 'Cookie security validation failed' });
    }

    // レスポンスヘッダーにセキュアなCookieを設定
    res.setHeader('Set-Cookie', [sessionCookie, authCookie, userCookie]);

    // セッション情報をレスポンスに含める（機密情報は除外）
    res.status(200).json({
      success: true,
      sessionId: sessionId.substring(0, 8) + '...', // 部分的な表示のみ
      userId,
      userName,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分後
      securityFeatures: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      }
    });

  } catch (error) {
    console.error('Secure session creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
