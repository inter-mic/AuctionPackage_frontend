import { NextApiRequest, NextApiResponse } from 'next';
import { formatCookieHeader, getSessionCookieOptions } from '@/utils/cookieUtils';

/**
 * セキュアなセッション検証API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId, authToken, userId, userName } = req.cookies;

    // セッション情報の検証
    if (!sessionId || !authToken) {
      return res.status(401).json({ message: 'Session not found' });
    }

    // セッションの有効性をチェック（実際の実装では適切な検証ロジックを使用）
    const isValidSession = sessionId.startsWith('session_') && authToken.startsWith('auth_');

    if (!isValidSession) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    // セッションが有効な場合、セキュアなクッキーを再設定（セッション延長）
    const sessionOptions = getSessionCookieOptions();
    const authOptions = getSessionCookieOptions();

    const sessionCookie = formatCookieHeader('sessionId', sessionId, sessionOptions);
    const authCookie = formatCookieHeader('authToken', authToken, authOptions);

    // セキュアなクッキーを再設定
    res.setHeader('Set-Cookie', [
      sessionCookie,
      authCookie,
    ]);

    return res.status(200).json({
      message: 'Session is valid',
      userId: userId || null,
      userName: userName || null,
      sessionId,
    });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

