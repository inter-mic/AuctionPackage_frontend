import { NextApiRequest, NextApiResponse } from 'next';
import { getCSPConfigForPath, generateCSPHeader } from '@/utils/cspUtils';

/**
 * CSP設定のテスト用API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { path = '/' } = req.query;
    const pathname = typeof path === 'string' ? path : '/';
    
    // パスに基づくCSP設定を取得
    const cspConfig = getCSPConfigForPath(pathname);
    const cspHeader = generateCSPHeader(cspConfig);
    
    // テスト用HTMLを生成
    const testHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>CSP Test Page</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>Content Security Policy Test</h1>
    <p>Path: ${pathname}</p>
    
    <h2>CSP Configuration</h2>
    <pre>${JSON.stringify(cspConfig, null, 2)}</pre>
    
    <h2>CSP Header</h2>
    <pre>${cspHeader}</pre>
    
    <h2>Test Cases</h2>
    
    <h3>1. Inline Script Test</h3>
    <script>
        // このスクリプトが実行されるかテスト
        document.getElementById('inline-script-result').innerHTML = 'Inline script executed';
    </script>
    <div id="inline-script-result">Inline script blocked</div>
    
    <h3>2. External Script Test</h3>
    <script src="https://example.com/script.js"></script>
    <div id="external-script-result">External script test</div>
    
    <h3>3. Inline Style Test</h3>
    <style>
        body { background-color: red; }
    </style>
    <div id="inline-style-result">Inline style test</div>
    
    <h3>4. External Style Test</h3>
    <link rel="stylesheet" href="https://example.com/style.css">
    <div id="external-style-result">External style test</div>
    
    <h3>5. Image Test</h3>
    <img src="https://example.com/image.jpg" alt="External image">
    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..." alt="Data URI image">
    
    <h3>6. Iframe Test</h3>
    <iframe src="https://example.com" width="400" height="200"></iframe>
    
    <p>CSPが正しく設定されていれば、上記のテストの多くがブロックされます。</p>
</body>
</html>
    `;
    
    // HTMLレスポンスを返す
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(testHTML);
  } catch (error) {
    console.error('CSP test error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
