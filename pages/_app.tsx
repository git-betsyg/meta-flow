import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import WebVitals from "@/components/web-vitals";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <WebVitals />
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}
