import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/zh-cn';
//スタイル
import '@/styles/globals.css';



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
     <Component {...pageProps} />
    </LocalizationProvider>
  );

  }

export default MyApp;