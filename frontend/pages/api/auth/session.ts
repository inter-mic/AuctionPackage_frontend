import { NextApiRequest, NextApiResponse } from 'next';
import { formatCookieHeader, getSessionCookieOptions } from '@/utils/cookieUtils';

/**
 * セキュアなセッション作成API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ message: 'userId and userName are required' });
    }

    // セッションIDを生成（実際の実装では適切なセッションID生成ロジックを使用）
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // セキュアなクッキーオプションを取得
    const sessionOptions = getSessionCookieOptions();
    const authOptions = getSessionCookieOptions();

    // セキュアなクッキーを設定
    const sessionCookie = formatCookieHeader('sessionId', sessionId, sessionOptions);
    const authCookie = formatCookieHeader('authToken', authToken, authOptions);
    const userCookie = formatCookieHeader('userId', userId, sessionOptions);
    const userNameCookie = formatCookieHeader('userName', userName, sessionOptions);

    // Set-Cookieヘッダーを設定
    res.setHeader('Set-Cookie', [
      sessionCookie,
      authCookie,
      userCookie,
      userNameCookie,
    ]);

    return res.status(200).json({
      message: 'Session created successfully',
      sessionId,
      authToken,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
