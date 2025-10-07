import { NextApiRequest, NextApiResponse } from 'next';
import { generateMIMESniffingTestHTML } from '@/utils/securityHeadersUtils';

/**
 * MIMEスニッフィング攻撃のテスト用API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // テスト用HTMLを生成
    const testHTML = generateMIMESniffingTestHTML();
    
    // HTMLレスポンスを返す
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(testHTML);
  } catch (error) {
    console.error('MIME sniffing test error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

