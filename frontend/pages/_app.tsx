import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import 'dayjs/locale/zh-cn';
//スタイル
import '@/styles/globals.css';
import '@/styles/mui-fixes.css';
//コンテキスト
import { GoodsListProvider } from '@/contexts/GoodsListContext';



// Material-UIのテーマ設定（CSSクラス名の一貫性を保つ）
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // デフォルトの青色
    },
    secondary: {
      main: '#dc004e', // デフォルトの赤色
    },
  },
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
    MuiCheckbox: {
      styleOverrides: {
        root: {
          // チェックボックスの色を明示的に設定
          '&.Mui-checked': {
            color: '#f44336', // 赤色を明示的に設定
          },
        },
      },
    },
  },
});

// Emotionキャッシュの設定（CSP対応）
const cache = createCache({
  key: 'mui',
  prepend: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={cache}>
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
    </CacheProvider>
  );
}

export default MyApp;