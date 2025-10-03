import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import 'dayjs/locale/zh-cn';
//スタイル
import '@/styles/globals.css';
import '@/styles/mui-fixes.css';
//コンテキスト
import { GoodsListProvider } from '@/contexts/GoodsListContext';



// Material-UIのテーマ設定（CSSクラス名の一貫性を保つ）
const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // CSSクラス名の一貫性を保つための設定
          '&.MuiSvgIcon-fontSizeMedium': {
            fontSize: '1.5rem',
          },
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoodsListProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Head>
            <title></title>
          </Head>
          <Component {...pageProps} />
        </LocalizationProvider>
      </GoodsListProvider>
    </ThemeProvider>
  );
}

export default MyApp;