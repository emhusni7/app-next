import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-notifications/lib/notifications.css';
import theme from '../src/components/Layout/theme';
import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';
import NotifApp from '../src/components/Fields/notification';



const NotFoundPage = () => {
  return (
    <>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, there is nothing to see here</p>
      </div>
    </>
  );
};

export default function MyApp({ Component, pageProps}) {
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
      <NotifApp>
        <Component {...pageProps} />  
      </NotifApp>
    </Layout>
  </ThemeProvider>)
}




