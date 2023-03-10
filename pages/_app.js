// Next
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

import Layout from "../components/Layout";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "nprogress/nprogress.css";
import { SSRProvider } from "react-bootstrap";

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <SessionProvider session={pageProps.session}>
        <TopProgressBar />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </SSRProvider>
  );
}

export default MyApp;
