import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../utils/db';
import { Provider, signIn, useSession } from "next-auth/client"
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [session, loading] = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log(session)
    return (
      <Provider session={pageProps.session}>
        <Component user={session.user} {...pageProps} />
      </Provider>
    );
  }
  signIn();
  return null;
}
export default MyApp
