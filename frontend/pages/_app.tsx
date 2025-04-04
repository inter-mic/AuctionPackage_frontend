import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn';
//スタイル
import '@/styles/globals.css';



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Head>
        <title></title>
      </Head>
     <Component {...pageProps} />
    </LocalizationProvider>
  );

  }

export default MyApp;