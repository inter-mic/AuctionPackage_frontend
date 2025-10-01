import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn';
//スタイル
import '@/styles/globals.css';
//コンテキスト
import { GoodsListProvider } from '@/contexts/GoodsListContext';
//CSP設定
import { generateNonce } from '@/utils/cspUtils';



function MyApp({ Component, pageProps }: AppProps) {
  // CSP用のnonce値を生成
  const nonce = generateNonce();

  return (
    <GoodsListProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <Head>
          <title></title>
          <meta httpEquiv="Content-Security-Policy" content={`default-src 'self'; script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'nonce-${nonce}' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`} />
        </Head>
        <Component {...pageProps} />
      </LocalizationProvider>
    </GoodsListProvider>
  );
}

export default MyApp;