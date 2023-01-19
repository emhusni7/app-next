import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'react-notifications/lib/notifications.css';
import theme from '../src/components/Layout/theme';
import Layout from "../src/components/Layout";
import { useRouter } from 'next/router';
import NotifApp from '../src/components/Fields/notification';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const staticPage = router.pathname.startsWith('/login');
  if (staticPage)
  {
    return (<Component {...pageProps} />)
  }

  function createNotif(type, message, title){
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info(message);
          break
        case 'success':
          NotificationManager.success(message, title);
          break
        case 'warning':
          NotificationManager.warning(message, title, 3000);
          break;
        case 'error':
          NotificationManager.error(message, title,5000);
          break;
      }
    }
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




