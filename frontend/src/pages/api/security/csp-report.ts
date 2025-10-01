import { NextApiRequest, NextApiResponse } from 'next';

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const report: CSPViolationReport = req.body;
    
    if (!report['csp-report']) {
      return res.status(400).json({ error: 'Invalid CSP report format' });
    }

    const violation = report['csp-report'];
    
    // CSP違反のログ出力
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      documentUri: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      blockedUri: violation['blocked-uri'],
      sourceFile: violation['source-file'],
      lineNumber: violation['line-number'],
      columnNumber: violation['column-number'],
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    // 本番環境では外部のセキュリティ監視サービスに送信
    if (process.env.NODE_ENV === 'production') {
      // 例: Sentry、DataDog、またはカスタム監視サービスへの送信
      await sendToSecurityMonitoring(violation);
    }

    res.status(200).json({ 
      success: true, 
      message: 'CSP violation report received' 
    });

  } catch (error) {
    console.error('CSP Report processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendToSecurityMonitoring(violation: any) {
  // セキュリティ監視サービスへの送信ロジック
  // 例: Sentry、DataDog、カスタムAPIなど
  console.log('Sending CSP violation to security monitoring:', violation);
}

