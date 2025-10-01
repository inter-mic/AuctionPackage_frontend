import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Cookieからセッション情報を取得
    const cookies = parse(req.headers.cookie || '');
    const sessionId = cookies['__Host-sessionId'];
    const authToken = cookies['__Host-authToken'];

    if (!sessionId || !authToken) {
      return res.status(401).json({ 
        error: 'Session not found',
        authenticated: false 
      });
    }

    // セッションIDとトークンの検証（実際の実装ではデータベースで検証）
    // ここでは基本的な形式チェックのみ
    if (sessionId.length !== 64 || authToken.length !== 64) {
      return res.status(401).json({ 
        error: 'Invalid session format',
        authenticated: false 
      });
    }

    // セッションが有効な場合
    res.status(200).json({
      authenticated: true,
      sessionId,
      message: 'Session is valid'
    });

  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      authenticated: false 
    });
  }
}



