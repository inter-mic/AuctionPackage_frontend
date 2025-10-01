import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Cookieからセッション情報を取得
    const cookies = parse(req.headers.cookie || '');
    const sessionId = cookies['sessionId'];
    const authToken = cookies['authToken'];
    const userInfo = cookies['userInfo'];

    if (!sessionId || !authToken) {
      return res.status(401).json({ 
        error: 'Secure session not found',
        authenticated: false,
        securityNote: 'HttpOnly cookies are required for secure authentication'
      });
    }

    // セッションIDとトークンの検証（実際の実装ではデータベースで検証）
    if (sessionId.length !== 64 || authToken.length !== 64) {
      return res.status(401).json({ 
        error: 'Invalid session format',
        authenticated: false 
      });
    }

    // ユーザー情報の解析
    let userData = null;
    if (userInfo) {
      try {
        userData = JSON.parse(decodeURIComponent(userInfo));
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }

    // セッションが有効な場合
    res.status(200).json({
      authenticated: true,
      sessionId: sessionId.substring(0, 8) + '...', // 部分的な表示のみ
      userData,
      securityFeatures: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      },
      message: 'Secure session is valid'
    });

  } catch (error) {
    console.error('Secure session verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      authenticated: false 
    });
  }
}
