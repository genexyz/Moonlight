// Next
import Head from "next/head";

// Components
import Header from "./Header";
import { NotificationContainer } from "react-notifications";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Moonlight Travel" />
        <meta
          property="description"
          content="Manage your trips to Inner and Outer Space safely"
        />
        <meta
          name="description"
          content="Manage your trips to Inner and Outer Space safely"
        />
        <meta
          property="og:description"
          content="Manage your trips to Inner and Outer Space safely"
        />
        <meta property="og:image" content="/images/destinations/Background.webp" />
        <meta property="og:site_name" content="Moonlight Travel" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Est. reading time" />
        <meta name="twitter:data1" content="4 minutes" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <NotificationContainer />
    </>
  );
}
