import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-notifications/lib/notifications.css';
import theme from '../src/components/Layout/theme';
import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';


export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const staticPage = router.pathname.startsWith('/login');
  if (staticPage)
  {
    return (<Component {...pageProps} />)
  }
  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Layout>
        <Component {...pageProps} />  
    </Layout>
  </ThemeProvider>)
}




