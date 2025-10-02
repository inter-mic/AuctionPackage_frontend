import { NextApiRequest, NextApiResponse } from 'next';
import { validateCSPViolation } from '@/utils/cspUtils';

/**
 * CSP違反レポートを受信するAPI
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const report = req.body;
    
    // CSP違反の検証
    const validation = validateCSPViolation(report);
    
    // ログ出力（本番環境では適切なログ管理システムを使用）
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      report,
      validation,
    });

    // 違反レポートをデータベースに保存（実装例）
    // await saveCSPViolationReport({
    //   timestamp: new Date(),
    //   userAgent: req.headers['user-agent'],
    //   report,
    //   validation,
    // });

    return res.status(200).json({
      message: 'CSP violation report received',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('CSP report processing error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
