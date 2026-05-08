import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import WebVitals from "@/components/web-vitals";
import { SessionProvider } from "next-auth/react";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const [queryClient] = React.useState(() => new QueryClient());
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <WebVitals />
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <div className={`${geistSans.variable} ${geistMono.variable} `}>
              {getLayout(<Component {...pageProps} />)}
            </div>
          </SessionProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
