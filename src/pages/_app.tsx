import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { css } from '@emotion/react';
import { AnimatePresence } from 'framer-motion';

import Footer from '../components/Footer';
import Nav from '../components/Nav';
import Scene from '../components/Scene';
import { BASE_URL } from '../constants/common';
import GlobalStyle from '../styles/GlobalStyle';

export default function App({ Component, pageProps, router }: AppProps) {
  const CURRENT_URL = BASE_URL + router.route;
  const shouldHideScene =
    router.pathname.startsWith('/feature/team-building') ||
    router.pathname === '/feature/team-building/welcome';

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <>
      <Head>
        <link rel="canonical" href={CURRENT_URL} />
        <meta property="og:url" content={CURRENT_URL} />
      </Head>
      <GlobalStyle />
      <Nav />
      {!shouldHideScene && <Scene />}

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        <div
          key={CURRENT_URL}
          css={css`
            position: relative;
            z-index: 99;
          `}
        >
          <Component {...pageProps} />
        </div>
      </AnimatePresence>
      <Footer />
    </>
  );
}
