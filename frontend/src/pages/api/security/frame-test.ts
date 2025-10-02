import { NextApiRequest, NextApiResponse } from 'next';
import { generateFrameTestHTML } from '@/utils/frameProtectionUtils';

/**
 * X-Frame-Optionsヘッダーのテスト用API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { targetUrl } = req.query;
    
    if (!targetUrl || typeof targetUrl !== 'string') {
      return res.status(400).json({ message: 'targetUrl parameter is required' });
    }

    // テスト用HTMLを生成
    const testHTML = generateFrameTestHTML(targetUrl);
    
    // HTMLレスポンスを返す
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(testHTML);
  } catch (error) {
    console.error('Frame test error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
