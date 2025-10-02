import { NextApiRequest, NextApiResponse } from 'next';
import { validateAWSALBCookie, isAWSALBCookie } from '@/utils/awsAlbCookieUtils';

/**
 * AWS ALBクッキーのセキュリティテスト用API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // リクエストからAWS ALBクッキーを取得
    const { AWSALB, AWSALBCORS } = req.cookies;
    
    const testResults = {
      awsAlbCookies: {
        AWSALB: AWSALB || 'Not Found',
        AWSALBCORS: AWSALBCORS || 'Not Found',
      },
      validations: {} as Record<string, any>,
      recommendations: [] as string[],
    };

    // AWS ALBクッキーの検証
    if (AWSALB) {
      const awsAlbCookieString = `AWSALB=${AWSALB}`;
      testResults.validations.AWSALB = validateAWSALBCookie(awsAlbCookieString);
      testResults.recommendations.push(...testResults.validations.AWSALB.recommendations);
    }

    if (AWSALBCORS) {
      const awsAlbCorsCookieString = `AWSALBCORS=${AWSALBCORS}`;
      testResults.validations.AWSALBCORS = validateAWSALBCookie(awsAlbCorsCookieString);
      testResults.recommendations.push(...testResults.validations.AWSALBCORS.recommendations);
    }

    // セキュリティヘッダーの確認
    const securityHeaders = {
      'Cache-Control': res.getHeader('Cache-Control') || 'Not Set',
      'X-Content-Type-Options': res.getHeader('X-Content-Type-Options') || 'Not Set',
      'X-Frame-Options': res.getHeader('X-Frame-Options') || 'Not Set',
      'Content-Security-Policy': res.getHeader('Content-Security-Policy') || 'Not Set',
    };

    return res.status(200).json({
      message: 'AWS ALB Cookie Security Test',
      testResults,
      securityHeaders,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AWS ALB cookie test error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
